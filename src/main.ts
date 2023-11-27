import { initGL } from './utils';
import TriangleDemo from './рrograms/triangle-demo';
import SinWave from './рrograms/sin-wave';
import christmasTree2D from './рrograms/2d-christmas-tree';
import SnowFall from './рrograms/snow-demo'

export enum ProgramDemoType {
  TRIANGLE,
  SIN_WAVE,
  XMAS_2D,
  SNOW_FALL
}

const demoDirectory = {
  [ProgramDemoType.TRIANGLE]: TriangleDemo,
  [ProgramDemoType.SIN_WAVE]: SinWave,
  [ProgramDemoType.XMAS_2D]: christmasTree2D,
  [ProgramDemoType.SNOW_FALL]: SnowFall,
}

export function makeGameLoop(mode: ProgramDemoType): void {
  const demoObject = demoDirectory[mode];
  const {VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE} = demoObject
  const params = initGL(VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE)
  const loop = demoObject.makeLoop(params);
  requestAnimationFrame(loop);
}