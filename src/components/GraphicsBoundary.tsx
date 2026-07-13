"use client";

import { Component, type ReactNode } from "react";

export class GraphicsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() { return this.state.failed ? null : this.props.children; }
}
