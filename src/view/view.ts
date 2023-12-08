import { mat4 } from "gl-matrix";
import { MVPMatrix } from "./MVP";


export class ViewMatrix extends MVPMatrix {

  constructor(eye: vector3, center: vector3) {
    const out = ViewMatrix.IDENTITY;
    mat4.lookAt(out, eye, center, [0, 1, 0])
    super(out);
  }

}