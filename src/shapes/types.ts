
export type BasicShapeOptions = {
  transform?: ShapeTransformOptions,
}

export type ShapeTransformOptions = {
  move?: vector3,
  scale?: number,
  rotate?: {
    origin: vector3,
    rotation: vector3
  },
}

export type BoxShapeOptions = BasicShapeOptions & {
  // none?
}

export type CircleLikeOptions = {
  center?: vector3,
  radius?: number,
  segments?: number
}

export type CircleShapeOptions = BasicShapeOptions & {
  circle?: CircleLikeOptions
}

// TODO: TBH a circle is just a cone, sooo... maybe unify them, at some point.
export type ConeShapeOptions = BasicShapeOptions & {
  cone?: CircleLikeOptions & {length?: number}
}

export type CylinderShapeOptions = BasicShapeOptions & {
  cylinder: CircleLikeOptions & {length?: number}
}