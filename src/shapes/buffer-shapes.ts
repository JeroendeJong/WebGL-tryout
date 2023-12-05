import { DrawType } from ".";
import { makePrimativeBox, makePrimativeCircle, makePrimativeCone, makePrimativeCylinder, makePrimativeLine, makePrimativeTriangle } from "./primative-shape";
import { shapeToBuffer } from "./shape-utils";

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

export function makeBoxBuffer(options: BoxShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeBox(options),
    type: DrawType.TRIANGLE
  })
}

export function makeLineBuffer(options: BasicShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeLine(options),
    type: DrawType.LINES
  })
}

export function makeTriangleBuffer(options: BasicShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeTriangle(options),
    type: DrawType.TRIANGLE
  })
}

export function makeCircleBuffer(options: CircleShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeCircle(options),
    type: DrawType.TRIANGLE
  })
}

export function makeConeBuffer(options: ConeShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeCone(options),
    type: DrawType.TRIANGLE
  })
}

export function makeCylinderBuffer(options: CylinderShapeOptions): BufferedShape {
  return shapeToBuffer({
    shapes: makePrimativeCylinder(options),
    type: DrawType.TRIANGLE
  })
}

