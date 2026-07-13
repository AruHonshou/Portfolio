import * as THREE from "three";
import { FLUID_CONFIG, type FluidQuality } from "./fluidConfig";

const vertexShader = `
  precision highp float;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const shaders = {
  clear: `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main(){ gl_FragColor = texture2D(uTexture,vUv)*value; }`,
  splat: `
    precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
    uniform vec2 point; uniform vec3 color; uniform float radius;
    void main(){ vec2 p=vUv-point; p.x*=aspectRatio; vec3 splat=exp(-dot(p,p)/radius)*color; gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+splat,1.0); }
  `,
  advection: `
    precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
    uniform vec2 texelSize; uniform float dt; uniform float dissipation;
    void main(){ vec2 velocity=texture2D(uVelocity,vUv).xy; vec2 coord=vUv-dt*velocity*texelSize; gl_FragColor=texture2D(uSource,coord)*dissipation; }
  `,
  divergence: `
    precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 texelSize;
    void main(){ float l=texture2D(uVelocity,vUv-vec2(texelSize.x,0.0)).x; float r=texture2D(uVelocity,vUv+vec2(texelSize.x,0.0)).x; float b=texture2D(uVelocity,vUv-vec2(0.0,texelSize.y)).y; float t=texture2D(uVelocity,vUv+vec2(0.0,texelSize.y)).y; gl_FragColor=vec4(0.5*(r-l+t-b),0.0,0.0,1.0); }
  `,
  curl: `
    precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 texelSize;
    void main(){ float l=texture2D(uVelocity,vUv-vec2(texelSize.x,0.0)).y; float r=texture2D(uVelocity,vUv+vec2(texelSize.x,0.0)).y; float b=texture2D(uVelocity,vUv-vec2(0.0,texelSize.y)).x; float t=texture2D(uVelocity,vUv+vec2(0.0,texelSize.y)).x; gl_FragColor=vec4(0.5*(r-l-b+t),0.0,0.0,1.0); }
  `,
  vorticity: `
    precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uCurl;
    uniform vec2 texelSize; uniform float curl; uniform float dt;
    void main(){ float l=abs(texture2D(uCurl,vUv-vec2(texelSize.x,0.0)).x); float r=abs(texture2D(uCurl,vUv+vec2(texelSize.x,0.0)).x); float b=abs(texture2D(uCurl,vUv-vec2(0.0,texelSize.y)).x); float t=abs(texture2D(uCurl,vUv+vec2(0.0,texelSize.y)).x); float c=texture2D(uCurl,vUv).x; vec2 force=0.5*vec2(t-b,r-l); force/=length(force)+0.0001; force*=curl*c; force.y*=-1.0; vec2 velocity=texture2D(uVelocity,vUv).xy; gl_FragColor=vec4(velocity+force*dt,0.0,1.0); }
  `,
  pressure: `
    precision highp float; varying vec2 vUv; uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 texelSize;
    void main(){ float l=texture2D(uPressure,vUv-vec2(texelSize.x,0.0)).x; float r=texture2D(uPressure,vUv+vec2(texelSize.x,0.0)).x; float b=texture2D(uPressure,vUv-vec2(0.0,texelSize.y)).x; float t=texture2D(uPressure,vUv+vec2(0.0,texelSize.y)).x; float d=texture2D(uDivergence,vUv).x; gl_FragColor=vec4((l+r+b+t-d)*0.25,0.0,0.0,1.0); }
  `,
  gradient: `
    precision highp float; varying vec2 vUv; uniform sampler2D uPressure; uniform sampler2D uVelocity; uniform vec2 texelSize;
    void main(){ float l=texture2D(uPressure,vUv-vec2(texelSize.x,0.0)).x; float r=texture2D(uPressure,vUv+vec2(texelSize.x,0.0)).x; float b=texture2D(uPressure,vUv-vec2(0.0,texelSize.y)).x; float t=texture2D(uPressure,vUv+vec2(0.0,texelSize.y)).x; vec2 velocity=texture2D(uVelocity,vUv).xy-vec2(r-l,t-b); gl_FragColor=vec4(velocity,0.0,1.0); }
  `,
  display: `
    precision highp float; varying vec2 vUv; uniform sampler2D uTexture;
    void main(){ float ink=clamp(texture2D(uTexture,vUv).r,0.0,1.0); ink=smoothstep(0.012,0.82,ink); float glow=pow(ink,0.62); gl_FragColor=vec4(vec3(glow),clamp(glow*0.92,0.0,0.92)); }
  `,
};

interface DoubleTarget {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

function material(fragmentShader: string, uniforms: Record<string, THREE.IUniform> = {}) {
  return new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false, transparent: false });
}

export class FluidSimulation {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.Camera();
  private readonly geometry = new THREE.PlaneGeometry(2, 2);
  private readonly quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly materials: Record<string, THREE.ShaderMaterial>;
  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergence!: THREE.WebGLRenderTarget;
  private curlTarget!: THREE.WebGLRenderTarget;
  private simWidth = 1;
  private simHeight = 1;
  private dyeWidth = 1;
  private dyeHeight = 1;
  private viewportWidth = 1;
  private viewportHeight = 1;

  constructor(canvas: HTMLCanvasElement, private quality: FluidQuality) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.materials = {
      clear: material(shaders.clear, { uTexture: { value: null }, value: { value: 1 } }),
      splat: material(shaders.splat, { uTarget: { value: null }, aspectRatio: { value: 1 }, point: { value: new THREE.Vector2() }, color: { value: new THREE.Vector3() }, radius: { value: 1 } }),
      advection: material(shaders.advection, { uVelocity: { value: null }, uSource: { value: null }, texelSize: { value: new THREE.Vector2() }, dt: { value: 0.016 }, dissipation: { value: 1 } }),
      divergence: material(shaders.divergence, { uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
      curl: material(shaders.curl, { uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
      vorticity: material(shaders.vorticity, { uVelocity: { value: null }, uCurl: { value: null }, texelSize: { value: new THREE.Vector2() }, curl: { value: FLUID_CONFIG.curl }, dt: { value: 0.016 } }),
      pressure: material(shaders.pressure, { uPressure: { value: null }, uDivergence: { value: null }, texelSize: { value: new THREE.Vector2() } }),
      gradient: material(shaders.gradient, { uPressure: { value: null }, uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
      display: material(shaders.display, { uTexture: { value: null } }),
    };
    this.quad = new THREE.Mesh(this.geometry, this.materials.display);
    this.scene.add(this.quad);
  }

  resize(width: number, height: number, quality = this.quality) {
    const changedQuality = quality.simulationResolution !== this.quality.simulationResolution || quality.dyeResolution !== this.quality.dyeResolution;
    this.quality = quality;
    this.viewportWidth = Math.max(width, 1);
    this.viewportHeight = Math.max(height, 1);
    this.renderer.setPixelRatio(quality.pixelRatio);
    this.renderer.setSize(width, height, false);
    const [nextSimWidth, nextSimHeight] = this.resolution(quality.simulationResolution);
    const [nextDyeWidth, nextDyeHeight] = this.resolution(quality.dyeResolution);
    const changedSize = nextSimWidth !== this.simWidth || nextSimHeight !== this.simHeight || nextDyeWidth !== this.dyeWidth || nextDyeHeight !== this.dyeHeight;
    if (!this.velocity || changedQuality || changedSize) this.allocateTargets();
  }

  private resolution(base: number) {
    const aspect = this.viewportWidth / this.viewportHeight;
    return aspect > 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)];
  }

  private target(width: number, height: number, linear = false) {
    return new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      minFilter: linear ? THREE.LinearFilter : THREE.NearestFilter,
      magFilter: linear ? THREE.LinearFilter : THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
      format: THREE.RGBAFormat,
    });
  }

  private doubleTarget(width: number, height: number, linear = false): DoubleTarget {
    const pair: DoubleTarget = { read: this.target(width, height, linear), write: this.target(width, height, linear), swap: () => { const next = pair.read; pair.read = pair.write; pair.write = next; } };
    return pair;
  }

  private allocateTargets() {
    this.disposeTargets();
    [this.simWidth, this.simHeight] = this.resolution(this.quality.simulationResolution);
    [this.dyeWidth, this.dyeHeight] = this.resolution(this.quality.dyeResolution);
    this.velocity = this.doubleTarget(this.simWidth, this.simHeight, true);
    this.dye = this.doubleTarget(this.dyeWidth, this.dyeHeight, true);
    this.pressure = this.doubleTarget(this.simWidth, this.simHeight);
    this.divergence = this.target(this.simWidth, this.simHeight);
    this.curlTarget = this.target(this.simWidth, this.simHeight);
  }

  private render(pass: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) {
    this.quad.material = pass;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  splat(x: number, y: number, dx: number, dy: number, ink = 0.42) {
    const pass = this.materials.splat;
    pass.uniforms.aspectRatio.value = this.viewportWidth / this.viewportHeight;
    pass.uniforms.point.value.set(x, y);
    pass.uniforms.radius.value = FLUID_CONFIG.splatRadius;
    pass.uniforms.uTarget.value = this.velocity.read.texture;
    pass.uniforms.color.value.set(dx, dy, 0);
    this.render(pass, this.velocity.write); this.velocity.swap();
    pass.uniforms.uTarget.value = this.dye.read.texture;
    pass.uniforms.color.value.set(ink, ink, ink);
    this.render(pass, this.dye.write); this.dye.swap();
  }

  step(dt: number) {
    const texel = new THREE.Vector2(1 / this.simWidth, 1 / this.simHeight);
    const curl = this.materials.curl;
    curl.uniforms.uVelocity.value = this.velocity.read.texture; curl.uniforms.texelSize.value.copy(texel);
    this.render(curl, this.curlTarget);
    const vort = this.materials.vorticity;
    vort.uniforms.uVelocity.value = this.velocity.read.texture; vort.uniforms.uCurl.value = this.curlTarget.texture; vort.uniforms.texelSize.value.copy(texel); vort.uniforms.dt.value = dt;
    this.render(vort, this.velocity.write); this.velocity.swap();
    const divergence = this.materials.divergence;
    divergence.uniforms.uVelocity.value = this.velocity.read.texture; divergence.uniforms.texelSize.value.copy(texel);
    this.render(divergence, this.divergence);
    const clear = this.materials.clear;
    clear.uniforms.uTexture.value = this.pressure.read.texture; clear.uniforms.value.value = FLUID_CONFIG.pressureDissipation;
    this.render(clear, this.pressure.write); this.pressure.swap();
    const pressure = this.materials.pressure;
    pressure.uniforms.uDivergence.value = this.divergence.texture; pressure.uniforms.texelSize.value.copy(texel);
    for (let i = 0; i < this.quality.pressureIterations; i += 1) { pressure.uniforms.uPressure.value = this.pressure.read.texture; this.render(pressure, this.pressure.write); this.pressure.swap(); }
    const gradient = this.materials.gradient;
    gradient.uniforms.uPressure.value = this.pressure.read.texture; gradient.uniforms.uVelocity.value = this.velocity.read.texture; gradient.uniforms.texelSize.value.copy(texel);
    this.render(gradient, this.velocity.write); this.velocity.swap();
    const advection = this.materials.advection;
    advection.uniforms.texelSize.value.copy(texel); advection.uniforms.dt.value = dt; advection.uniforms.uVelocity.value = this.velocity.read.texture; advection.uniforms.uSource.value = this.velocity.read.texture; advection.uniforms.dissipation.value = FLUID_CONFIG.velocityDissipation;
    this.render(advection, this.velocity.write); this.velocity.swap();
    advection.uniforms.texelSize.value.copy(texel); advection.uniforms.uVelocity.value = this.velocity.read.texture; advection.uniforms.uSource.value = this.dye.read.texture; advection.uniforms.dissipation.value = FLUID_CONFIG.dyeDissipation;
    this.render(advection, this.dye.write); this.dye.swap();
  }

  display() {
    this.materials.display.uniforms.uTexture.value = this.dye.read.texture;
    this.render(this.materials.display, null);
  }

  private disposeTargets() {
    for (const target of [this.velocity?.read, this.velocity?.write, this.dye?.read, this.dye?.write, this.pressure?.read, this.pressure?.write, this.divergence, this.curlTarget]) target?.dispose();
  }

  dispose() {
    this.disposeTargets();
    this.geometry.dispose();
    Object.values(this.materials).forEach((entry) => entry.dispose());
    this.renderer.dispose();
  }
}
