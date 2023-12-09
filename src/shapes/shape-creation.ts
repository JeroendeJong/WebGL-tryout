import { vec3 } from "gl-matrix";
import { ComplexShapeInfo, DrawType, PrimativeShape, FaceCull, ComplexShape, VertexShape, VertexShapetype } from ".";
import { BasicShapeOptions, ShapeTransformOptions } from "./types";

/**
 * transforms a complexshape in a format that WEBGL accepts as input for the VAO, with as a format:
 * XYZ, RGB, so 6 values per vertex.
 * @param shape 
 * @returns 
 */
export function makeVertexShape(shape: ComplexShape, drawType: DrawType, asType?: VertexShapetype): VertexShape {
  asType = asType || VertexShapetype.XYZ_RGB
  
  const dataset = shape.data.map(s => {
    if (asType === VertexShapetype.XYZ_RGB) {
      return s.primative.data.map(d => makeXYZ_RGBVertex(d, s.color))
    } else {
      throw new Error(`unkonwn AsType: ${asType}`)
    }
  })

  return {
    buffer: new Float32Array(dataset.flat(2)),
    type: VertexShapetype.XYZ_RGB,
    info: {
      numberOfcomponents: shape.numberOfcomponents,
      cull: shape.cull,
      type: drawType
    }
  }

  // in the future makeVertexShape can also support delivering seperate buffers for color, positions, normals etc..
  // however, for now it only supports one type of buffer: XYZ,RGB.
  function makeXYZ_RGBVertex(p: vector3, c: vector3) {
    return [...p, ...c]
  }

}


/**
 * Creates a complex shape which is essentially a group of primative shapes.
 * @param shapes 
 * @param cull 
 * @param options 
 * @returns 
 */
export function makeComplexShape(shapes: ComplexShapeInfo[], cull: FaceCull | undefined, options?: BasicShapeOptions): ComplexShape {
  const numberOfcomponents = shapes.reduce((agg, val) => agg + val.primative.numberOfcomponents, 0)

  const adjusted = shapes.map(csi => {
    const newShape = csi.primative.data.map(p => {
      if (options?.transform) return transformPoint(p, options.transform)
      return p
    })

    return {...csi, primative: { ...csi.primative, data: newShape }}
  }) as ComplexShapeInfo[]


  return {
    data: adjusted,
    numberOfcomponents,
    cull
  }
}

/**
 * Creates a primative shape from a set of xyz points. 
 * @param type 
 * @param data 
 * @param options 
 * @returns 
 */
export function makePrimativeShape(data: vector3[], options: BasicShapeOptions): PrimativeShape {
  const basicShapes = data.map(p => {
    if (options.transform) return transformPoint(p, options.transform)
    return p
  })

  return {
    numberOfcomponents: data.length,
    data: basicShapes,
  }
}

function transformPoint(point: vector3, transform: ShapeTransformOptions): vector3 {
  const out = [...point] as vector3

  if (transform.rotate) {
    const { rotation, origin } = transform.rotate
    vec3.rotateX(out, out, origin, rotation[0]);
    vec3.rotateY(out, out, origin, rotation[1]);
    vec3.rotateZ(out, out, origin, rotation[2]);
  }
  if (transform?.scale !== undefined) vec3.scale(out, out, transform?.scale);
  if (transform?.move !== undefined) vec3.add(out, out, transform?.move);

  return out;
}
