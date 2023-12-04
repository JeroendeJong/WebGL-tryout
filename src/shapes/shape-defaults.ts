

export function makeDefaultCircleOptions(options?: CircleOptions): Required<CircleOptions> {
  const center = options?.center || [0, 0, 0];
  const segments = options?.segments || 50
  const radius = options?.radius || 1
  return {center, segments, radius}
}

export function makeDefaultConeOptions(options?: ConeShapeOptions) {
  // TODO
}