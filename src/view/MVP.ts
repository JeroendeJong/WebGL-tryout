import { mat4 } from "gl-matrix";


function makeIdentity() {
  const matrix = new Float32Array(16)
  mat4.identity(matrix);
  return matrix
}

export class MVPMatrix {
  public rotation: vector4
  public matrix: Float32Array
  public scale: vector3
  public translation: vector3

  static get IDENTITY() {
    return makeIdentity()
  }
 
  constructor(matrix: Float32Array) {
    this.matrix = matrix

    const rotation = new Float32Array(4)
    this.rotation = mat4.getRotation(rotation, matrix)

    const scale = new Float32Array(3)
    this.scale = mat4.getScaling(scale, matrix)

    const translation = new Float32Array(3)
    this.translation = mat4.getTranslation(translation, matrix)
  }

  rotateY(angle: number): void {
    const out = makeIdentity()
    mat4.rotateY(out, out, angle)
    this.rotation[1] = angle
    this.matrix = out
  }
}

