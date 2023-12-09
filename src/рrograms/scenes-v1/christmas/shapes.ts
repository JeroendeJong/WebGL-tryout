import { xyz, rgb, radian } from "../../../math-utils"
import { DrawType, FaceCull, VertexShape, ComplexShapeInfo } from "../../../shapes"
import { makePrimativeCircle, makePrimativeCone, makePrimativeCylinder, makePrimativeRectangle, makePrimativeTriangle } from "../../../shapes/primative-shapes"
import { makeComplexShape, makeVertexShape } from "../../../shapes/shape-creation"
import { BasicShapeOptions } from "../../../shapes/types"

export function make3dChristmasTreeVertexShape(): VertexShape[] {
  const circleOptions = { segments: 20, length: 1.5 }

  const trunkVertex = makeTrunk()
  const lidVertex = makeConeLids()
  const coneVertex = makeCones()

  return [coneVertex, lidVertex, trunkVertex]

  function makeCones(): VertexShape {
    const bottomCone = {
      color: rgb(0.2078, 0.3451, 0.1608),
      primative: makePrimativeCone({
        transform: makeTransform(270, xyz(0, -0.5, 0)),
        cone: {...circleOptions, radius: 1.4},
      }),
    }

    const middleCone = {
      color: rgb(0.3373, 0.4902, 0.1882),
      primative: makePrimativeCone({
        transform: makeTransform(270, xyz(0, 0, 0)),
        cone: {...circleOptions, radius: 1.2}
      }),
    }

    const topCone = {
      color: rgb(0.5608, 0.6941, 0.3059),
      primative: makePrimativeCone({
        transform: makeTransform(270, xyz(0, 0.5, 0)),
        cone: {...circleOptions, radius: 1.0}
      }),
    }

    const shapes = [ bottomCone, middleCone, topCone ]
    const complexShape = makeComplexShape(shapes, FaceCull.BACK)
    return makeVertexShape(complexShape, DrawType.TRIANGLE)

  }

  function makeConeLids(): VertexShape {
    const bottomLid = {
      color: rgb(0.4608, 0.5941, 0.2059),
      primative: makePrimativeCircle({
        transform: makeTransform(90, xyz(0, 0.5, 0)),
        circle: {...circleOptions, radius: 1.0},
      }),
    }

    const middleLid = {
      color: rgb(0.2373, 0.3902, 0.0882),
      primative: makePrimativeCircle({
        transform: makeTransform(90, xyz(0, 0, 0)),
        circle: {...circleOptions, radius: 1.2},
      }),
    }

    const topLid = {
      color: rgb(0.1078, 0.2451, 0.0608),
      primative: makePrimativeCircle({
        transform: makeTransform(90, xyz(0, -0.5, 0)),
        circle: {...circleOptions, radius: 1.4},
      }),
    }

    const shapes = [ bottomLid, middleLid, topLid ]
    const complexShape = makeComplexShape(shapes, undefined)
    return makeVertexShape(complexShape, DrawType.TRIANGLE)
  }

  function makeTrunk(): VertexShape {
    const trunk = {
      color: rgb(0.3607, 0.1686, 0.1686),
      primative: makePrimativeCylinder({
        cylinder: {
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
    }

    const complexShape = makeComplexShape([trunk], undefined)
    return makeVertexShape(complexShape, DrawType.TRIANGLE)
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

export function make2dChristmasTreeVertexShape(options?: BasicShapeOptions): VertexShape {
  const trunk = {
    color: rgb(0.3607, 0.1686, 0.1686),
    primative: makePrimativeRectangle({
      transform: {
        scale: 0.1,
        move: xyz(0, -8, 0)
      }
    }),
  }

  const topLeaf = { 
    color: rgb(0.5608, 0.6941, 0.3059),
    primative: makePrimativeTriangle({
      transform: {
        scale: 0.3,
        move: xyz(0, 0.6, 0)
      }
    })
  }

  const middleLeaf = { 
    color: rgb(0.3373, 0.4902, 0.1882),
    primative: makePrimativeTriangle({
      transform: {
        scale: 0.4,
        move: xyz(0, 0, 0)
      }
    }) 
  }

  const bottomLeaf = { 
    color: rgb(0.2078, 0.3451, 0.1608),
    primative: makePrimativeTriangle({
      transform: {
        scale: 0.5,
        move: xyz(0, -0.5, 0)
      }
    }), 
  }

  const shapes = [ trunk, bottomLeaf, middleLeaf, topLeaf ]
  const complexShape = makeComplexShape(shapes, undefined, options)
  return makeVertexShape(complexShape, DrawType.TRIANGLE)
}