import { xyz, radian, rgb } from "../math-utils";
import { DrawType, VertexShape } from "../shapes";
import { makePrimativeLine } from "../shapes/primative-shapes";
import { makeComplexShape, makeVertexShape } from "../shapes/shape-creation";
import { BasicShapeOptions } from "../shapes/types";

export function makeAxesLineVertexShape(options?: BasicShapeOptions): VertexShape {
  const redX = {
    color: rgb(1, 0, 0),
    primative: makePrimativeLine({
      transform: {
        move: xyz(0,0,0),
        rotate: {
          origin: [0, 0, 0],
          rotation: [radian(0), radian(0), radian(270)]
        },
      }
    })
  }

  const greenY = {
    color: rgb(0, 1, 0),
    primative: makePrimativeLine({})
  }

  const blueZ = {
    color: rgb(0, 0, 1),
    primative: makePrimativeLine({
      transform: {
        move: xyz(0, 0, 0),
        rotate: {
          origin: [0, 0, 0],
          rotation: [radian(270), radian(0), radian(0)]
        },
      },
    })
  }

  const shapes = [ greenY, redX, blueZ ]
  const complexShape = makeComplexShape(shapes, undefined, options)
  return makeVertexShape(complexShape, DrawType.LINES)
}