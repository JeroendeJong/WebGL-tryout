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