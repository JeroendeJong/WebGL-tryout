

export enum FaceCull {
  FRONT = 'front',
  BACK = 'back',
  FRONT_AND_BACK = 'front_and_back'
}

export enum DrawType {
  POINTS = 'points',
  LINES = 'lines',
  TRIANGLE = 'triangle'
  // and others.....
}

export interface ShapeInformation {
  shapes: PrimativeShape[] | PrimativeShape
  cull?: FaceCull,
  type: DrawType
}