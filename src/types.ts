
type Vector2 = [number, number]
type Vector3 = [number, number, number]

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
  shape: (Vector2 | Vector3)[]
}

type BufferInformation = {
  numberOfcomponents: number,
  buffer: Float32Array
}

type ShapeOptions<T> = {
  move?: Vector3,
  scale?: number,
  rotate?: {
    origin: Vector3,
    rad: number
  }
  withColor?: T
}

type ShapeOptions3D<T> = {
  move?: Vector3,
  scale?: number,
  rotate?: {
    origin: Vector3,
    rad: number
  }
  withColor?: T
}