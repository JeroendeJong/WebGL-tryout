import { xyz, radian, rgb } from "../math-utils";
import { DrawType } from "../shapes";
import { makePrimativeLine } from "../shapes/primative-shape";
import { shapeToBuffer } from "../shapes/shape-utils";

export function makeAxesLinesBuffer(): BufferedShape {
  return shapeToBuffer({
    shapes: [
      // red = x
      makePrimativeLine({
        transform: {
          move: xyz(0,0,0),
          rotate: {
            origin: [0, 0, 0],
            rotation: [radian(0), radian(0), radian(270)]
          },
        },
        color: rgb(1, 0, 0)
      }),
      // green = y
      makePrimativeLine({
        color: rgb(0, 1, 0),
      }),
      // blue = z
      makePrimativeLine({
        transform: {
          move: xyz(0, 0, 0),
          rotate: {
            origin: [0, 0, 0],
            rotation: [radian(270), radian(0), radian(0)]
          },
        },
        color: rgb(0, 0, 1)
      }),
    ],
    type: DrawType.LINES
  })
}