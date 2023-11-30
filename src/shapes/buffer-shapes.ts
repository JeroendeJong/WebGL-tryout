import { makePrimativeCircle, makePrimativeCone, makePrimativeRectangle, makePrimativeTriangle } from "./primative-shape";
import { shapeToBuffer } from "../gl-utils";
import { radian, rgb, xyz } from "../math-utils";

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

export function makeTriangleBuffer(options: ShapeOptions): BufferInformation {
  return shapeToBuffer(makePrimativeTriangle(options))
}

export function makeCircleBuffer(options: CircleShapeOptions): BufferInformation {
  return shapeToBuffer(makePrimativeCircle(options))
}

export function makeConeBuffer(options: ConeShapeOptions): BufferInformation {
  return shapeToBuffer(makePrimativeCone(options))
}

export function make3dChristmasTreeShapeBuffer(): BufferInformation {
  return shapeToBuffer(
    // trunk
    // makePrimativeRectangle({
    //   color: rgb(0.3607, 0.1686, 0.1686),
    //   transform: {
    //     scale: 1,
    //     move: xyz(0, 0, 0)
    //   },
    // }),
    // leaves
    makePrimativeCone({ 
      color: rgb(0.2078, 0.3451, 0.1608),
      cone: {
        segments: 10,
        length: 1.5
      },
      transform: {
        rotate: {
          origin: xyz(0,0,0),
          rotation: xyz(radian(270), 0, 0),
        },
        move: xyz(0, 0, -0.5)
      }
    }),

    makePrimativeCone({ 
      color: rgb(0.3373, 0.4902, 0.1882),
      cone: {
        segments: 10,
        length: 1.5
      },
      transform: {
        rotate: {
          origin: xyz(0,0,0),
          rotation: xyz(radian(270), 0, 0),
        },
        move: xyz(0, 0, 0)
      }
    }),

    makePrimativeCone({ 
      color: rgb(0.5608, 0.6941, 0.3059),
      cone: {
        segments: 10,
        length: 1.5
      },
      transform: {
        rotate: {
          origin: xyz(0,0,0),
          rotation: xyz(radian(270), 0, 0),
        },
        move: xyz(0, 0, 0.5)
      }
    })
  )
}

export function make2dChristmasTreeShapeBuffer(): BufferInformation {
  return shapeToBuffer(
    // trunk
    makePrimativeRectangle({
      color: rgb(0.3607, 0.1686, 0.1686),
      transform: {
        scale: 0.1,
        move: xyz(0, -8, 0)
      },
    }),
    // leaves
    makePrimativeTriangle({ 
      color: rgb(0.2078, 0.3451, 0.1608),
      transform: {
        scale: 0.5,
        move: xyz(0, -0.5, 0)
      }
    }),
    makePrimativeTriangle({ 
      color: rgb(0.3373, 0.4902, 0.1882),
      transform: {
        scale: 0.4,
        move: xyz(0, 0, 0)
      }
    }),
    makePrimativeTriangle({ 
      color: rgb(0.5608, 0.6941, 0.3059),
      transform: {
        scale: 0.3,
        move: xyz(0, 0.6, 0)
      }
    }),
  )
}

