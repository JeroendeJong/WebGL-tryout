// The default method exposed by the module wraps a canvas element
import REGL from 'regl';
import { glsl } from '../../general/core-utils';

const VERTEX_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec3 vertexPosition;
  in vec3 vertexColor;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProjection;

  out vec3 fragmentColor;

  void main() {
    fragmentColor = vertexColor;

    gl_Position = mProjection * mView * mWorld * vec4(vertexPosition, 1.0);
    gl_PointSize = 15.0;
  }
`;

export const FRAGMENT_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec3 fragmentColor;

  out vec4 outputColor;

  void main() {
    outputColor = vec4(fragmentColor, 1.0);
  }
`;



interface Uniforms {
  color: REGL.Vec4;
}

interface Attributes {
  position: REGL.Vec2[];
}

export default function run() {

  const regl = REGL()

  // This clears the color buffer to black and the depth buffer to 1
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })


  const painter = regl<Uniforms, Attributes>({
    frag: FRAGMENT_SHADER_SOURCE_CODE,
    vert: VERTEX_SHADER_SOURCE_CODE,
    attributes: {
      position: [
        [-1, 0],
        [0, -1],
        [1, 1]
      ]
    },
  
    uniforms: {
      color: [1, 0, 0, 1]
    },
  
    count: 3
  })

  painter()

}

