import { mat4 } from "gl-matrix";
import { radian } from "../math-utils";
import { MVPMatrix } from "./MVP";


export class ProjectionMatrix extends MVPMatrix {

  constructor(ratio: number) {
    const out = ProjectionMatrix.IDENTITY
    mat4.perspective(out, radian(90), ratio, 0.1, 1000.0);
    super(out);
  }

}