import { initGL } from './general/core-utils';
import TriangleDemo from './рrograms/triangle-demo';
import SinWave from './рrograms/sin-wave';
import christmasTree2D from './рrograms/christmas/2d-christmas-tree';
import christmasTree3D from './рrograms/christmas/3d-christmas-tree';
import SnowFall from './рrograms/christmas/snow'

export enum ProgramDemoType {
  TRIANGLE,
  SIN_WAVE,
  XMAS_2D,
  XMAS_3D,
  SNOW_FALL
}

const demoDirectory = {
  [ProgramDemoType.TRIANGLE]: TriangleDemo,
  [ProgramDemoType.SIN_WAVE]: SinWave,
  [ProgramDemoType.XMAS_2D]: christmasTree2D,
  [ProgramDemoType.XMAS_3D]: christmasTree3D,
  [ProgramDemoType.SNOW_FALL]: SnowFall,
}

export function makeGameLoop(mode: ProgramDemoType): void {
  const demoObject = demoDirectory[mode];
  const {VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE} = demoObject
  const params = initGL(VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE)
  const frame = demoObject.makeLoop(params);
  
  function gameLoop() {
    frame()
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

export function makeCombinedGameLoop(modes: ProgramDemoType[]): void {
  const loops: WebGLLoopFunction[] = []

  for (let i = 0; i < modes.length; i++) {
    const mode = modes[i];
    const demoObject = demoDirectory[mode];
    const {VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE} = demoObject
    const params = initGL(VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE)
    loops.push(demoObject.makeLoop(params))
  }

  function gameLoop() {
    loops.forEach(loop => loop())
    requestAnimationFrame(gameLoop)
  }
   
  requestAnimationFrame(gameLoop);
}