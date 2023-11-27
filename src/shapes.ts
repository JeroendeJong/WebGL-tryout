import { makePrimativeRectangle, makePrimativeTriangle } from "./primative-shape";
import { shapeToBuffer } from "./gl-utils";
import { rgb, xyz } from "./math-utils";

/**
 * returns the hape with a range -1 to 1
 * @deprecated
 */
export function make2DSquareBuffer(): any {
  return {
    numberOfcomponents: 6,
    shape: new Float32Array([ 
      // Bottom left triangle
      -1, 1,
      -1, -1, 
      1, -1,
      
      // Top right triangle
      1, -1,
      1, 1,
      -1, 1
    ])
  }
}

export function makeTriangleBuffer(options: ShapeOptions<Vector3>): BufferInformation {
  return shapeToBuffer(
    makePrimativeTriangle(options)
  )
}

export function makeChristmasTreeShapeBuffer(): BufferInformation {
  return shapeToBuffer(
    // trunk
    makePrimativeRectangle({
      withColor: rgb(0.3607, 0.1686, 0.1686),
      scale: 0.1,
      move: xyz(0, -8, 0)
    }),
    // leaves
    makePrimativeTriangle({ 
      withColor: rgb(0.2078, 0.3451, 0.1608),
      scale: 0.5,
      move: xyz(0, -0.5, 0)
    }),
    makePrimativeTriangle({ 
      withColor: rgb(0.3373, 0.4902, 0.1882),
      scale: 0.4,
      move: xyz(0, 0, 0)
    }),
    makePrimativeTriangle({ 
      withColor: rgb(0.5608, 0.6941, 0.3059),
      scale: 0.3,
      move: xyz(0, 0.6, 0)
    }),
  )
}

