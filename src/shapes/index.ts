

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

export enum VertexShapetype {
  XYZ_RGB = 'xyz_rgb',
  // OTHERS in the future!
  // XYZ = 'xyz',
  // POINT = 'xyz_radius'
}


// PrimativeShape
// ComplexShape
  // contains a group of primativeShapes
  // reveals information about FaceCull & 
// VertexShape
  // Contains data in WebGL compatiable format
  // data array is in format XYZ, RGB


export interface PrimativeShape {
  numberOfcomponents: number,
  data: vector3[]

  // in the future normals for lightings, and index for cleaner and less GB in shape sizes :-)
  normals?: never,
  indexes?: never
}

export interface ComplexShape {
  data: ComplexShapeInfo[]
  numberOfcomponents: number,
  cull?: FaceCull,
}

export interface ComplexShapeInfo {
  color: vector3, // FUTURE: add the option to make this a func, for more detailed colouring.
  primative: PrimativeShape
}

export interface VertexShape {
  buffer: Float32Array
  info: VertexDrawInformation
  type: VertexShapetype
}

export interface VertexDrawInformation {
  cull?: FaceCull,
  type: DrawType,
  numberOfcomponents: number,
}

