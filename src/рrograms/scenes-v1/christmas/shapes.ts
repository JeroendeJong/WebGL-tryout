import { xyz, rgb, radian } from "../../../math-utils"
import { ShapeInformation, DrawType, FaceCull } from "../../../shapes"
import { makePrimativeBox, makePrimativeCone, makePrimativeCircle, makePrimativeCylinder, makePrimativeRectangle, makePrimativeTriangle } from "../../../shapes/primative-shape"
import { shapeToBuffer } from "../../../shapes/shape-utils"

export function make3dChristmasTreeShapeBuffer(generalOptions: ShapeTransformOptions): BufferedShape[] {
  const circleOptions = { segments: 20, length: 1.5 }

  const trunk = makeTrunk()
  const circles = makeConeLids()
  const cones = makeCones()
  // const lights = placeLightsOnCones(cones)

  return [
    shapeToBuffer(circles), 
    shapeToBuffer(trunk), 
    shapeToBuffer(cones),
    // shapeToBuffer(lights),
  ]

  ///
  ///
  ///

  // function placeLightsOnCones(cones: ShapeInformation): ShapeInformation {
  //   if (!Array.isArray(cones.shapes)) {
  //     throw new Error('W')
  //   }

  //   const out = cones.shapes.map(cone => {
  //     const shapes: PrimativeShape[] = []
  //     // find 5 xyz points
  //     for (let i = 0; i < 5; i++) {
  //       const randomIndex = Math.floor(Math.random() * cone.shape.length);
  //       const s = [...cone.shape[randomIndex]]
  //       const point = makePrimativeBox({ 
  //         transform: { 
  //           scale: 0.1,
  //           move: xyz(s[0], s[1], s[2]),
  //         },
  //         color: rgb(1, 0, 0),
  //       })
  //       shapes.push(point)
  //     }
  //     return shapes
  //   })

  //   return {
  //     shapes: out.flat(1),
  //     type: DrawType.TRIANGLE,
  //   }
  // }

  function makeCones(): ShapeInformation {
    return {
      cull: FaceCull.BACK,
      type: DrawType.TRIANGLE,
      shapes: [
        makePrimativeCone({ 
          color: rgb(0.2078, 0.3451, 0.1608),
          cone: {...circleOptions, radius: 1.4},
          transform: makeTransform(270, xyz(0, -0.5, 0))
        }),
        makePrimativeCone({ 
          color: rgb(0.3373, 0.4902, 0.1882),
          cone: {...circleOptions, radius: 1.2},
          transform: makeTransform(270, xyz(0, 0, 0))
        }),
        makePrimativeCone({ 
          color: rgb(0.5608, 0.6941, 0.3059),
          cone: {...circleOptions, radius: 1.0},
          transform: makeTransform(270, xyz(0, 0.5, 0))
        }),
      ]
    }
  }

  function makeConeLids(): ShapeInformation {
    return {
      type: DrawType.TRIANGLE,
      shapes: [
        makePrimativeCircle({ 
          color: rgb(0.4608, 0.5941, 0.2059),
          circle: {...circleOptions, radius: 1.0},
          transform: makeTransform(90, xyz(0, 0.5, 0))
        }),
        makePrimativeCircle({ 
          color: rgb(0.2373, 0.3902, 0.0882),
          circle: {...circleOptions, radius: 1.2},
          transform: makeTransform(90, xyz(0, 0, 0))
        }),
        makePrimativeCircle({ 
          color: rgb(0.1078, 0.2451, 0.0608),
          circle: {...circleOptions, radius: 1.4},
          transform: makeTransform(90, xyz(0, -0.5, 0))
        }),
      ]
    }
  }

  function makeTrunk(): ShapeInformation {
    return {
      type: DrawType.TRIANGLE,
      shapes: [
        makePrimativeCylinder({
          color: rgb(0.3607, 0.1686, 0.1686),
          cone: {
            segments: 20,
            radius: 0.5,
            length: 4
          },
          transform: {
            ...makeTransform(90, xyz(0, 0, 0)),
            move: xyz(0, -0.25, 0),
            scale: 0.25
          }
        })
      ]
    }
  }

  function makeTransform(rotateX: number, move: vector3) {
    return {
      rotate: {
        origin: xyz(0,0,0),
        rotation: xyz(radian(rotateX), 0, 0),
      },
      move
    }
  }
}

export function make2dChristmasTreeShapeBuffer(): BufferedShape {
  return shapeToBuffer({
    shapes: [
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
    ],
    type: DrawType.TRIANGLE
  })
}

