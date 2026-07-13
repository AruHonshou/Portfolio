export interface FluidQuality {
  simulationResolution: number;
  dyeResolution: number;
  pressureIterations: number;
  pixelRatio: number;
}

export function getFluidQuality(width: number, devicePixelRatio: number): FluidQuality {
  if (width < 640) {
    return { simulationResolution: 128, dyeResolution: 384, pressureIterations: 10, pixelRatio: 1 };
  }
  if (width < 1100) {
    return { simulationResolution: 192, dyeResolution: 512, pressureIterations: 12, pixelRatio: Math.min(devicePixelRatio, 1.25) };
  }
  return { simulationResolution: 256, dyeResolution: 768, pressureIterations: 16, pixelRatio: Math.min(devicePixelRatio, 1.5) };
}

export const FLUID_CONFIG = {
  velocityDissipation: 0.985,
  dyeDissipation: 0.992,
  pressureDissipation: 0.82,
  curl: 22,
  splatRadius: 0.0075,
  pointerForce: 5200,
};
