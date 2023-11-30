type vector3 = import('gl-matrix').vec3
type vector2 = import('gl-matrix').vec2


type WebGLLoopFunction = () => void

type WebGLInit = { gl: WebGL2RenderingContext, program: WebGLProgram }

type DemoProgram = {
  VERTEX_SHADER_SOURCE_CODE: string,
  FRAGMENT_SHADER_SOURCE_CODE: string,
  makeLoop: WebGLLoopFunction
}

type ShapeInformation = {
  numberOfcomponents: number
  shape: []
}

type PrimativeShape = {
  numberOfcomponents: number,
  shape: number[][]
}

type BufferInformation = {
  numberOfcomponents: number,
  buffer: Float32Array
}

type ShapeOptions = {
  transform?: {
    move?: vector3,
    scale?: number,
    rotate?: {
      origin: vector3,
      rotation: vector3
    },
  },
  color?: vector3
}

type CircleOptions = {
  center?: vector3,
  radius?: number,
  segments?: number
}

type CircleShapeOptions = ShapeOptions & {
  circle?: CircleOptions
}

// TODO: TBH a circle is just a cone, sooo... maybe unify them, at some point.
type ConeShapeOptions = ShapeOptions & {
  cone?: CircleOptions & {length?: number}
}