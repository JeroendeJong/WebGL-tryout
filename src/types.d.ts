type vector3 = import('gl-matrix').vec3
type vector4 = import('gl-matrix').vec4
type vector2 = import('gl-matrix').vec2


type WebGLLoopFunction = (time: number) => void

type WebGLInit = { gl: WebGL2RenderingContext, program: WebGLProgram }

type DemoProgram = {
  VERTEX_SHADER_SOURCE_CODE: string,
  FRAGMENT_SHADER_SOURCE_CODE: string,
  makeLoop: WebGLLoopFunction
}

type PrimativeShape = {
  numberOfcomponents: number,
  shape: number[][]

  // in the future normals for lightings, and index for cleaner and less GB in shape sizes :-)
  normals?: never,
  indexes?: never
}

type BufferedShape = {
  buffer: Float32Array
  information: BufferDrawInformation
}

type BufferDrawInformation = {
  cull: FaceCull,
  type: DrawType,
  numberOfcomponents: number,
}

type BasicShapeOptions = {
  transform?: ShapeTransformOptions,
  color: vector3
}

type ShapeTransformOptions = {
  move?: vector3,
  scale?: number,
  rotate?: {
    origin: vector3,
    rotation: vector3
  },
}

type BoxShapeOptions = {
  // none?
}

type CircleOptions = {
  center?: vector3,
  radius?: number,
  segments?: number
}

type CircleShapeOptions = BasicShapeOptions & {
  circle?: CircleOptions
}

// TODO: TBH a circle is just a cone, sooo... maybe unify them, at some point.
type ConeShapeOptions = BasicShapeOptions & {
  cone?: CircleOptions & {length?: number}
}

type CylinderShapeOptions = ConeShapeOptions