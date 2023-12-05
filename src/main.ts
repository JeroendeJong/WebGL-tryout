import { initGL } from './general/core-utils';
import TriangleDemo from './рrograms/scenes-v1/triangle';
import SinWave from './рrograms/scenes-v1/sin-wave';
import christmasTree2D from './рrograms/scenes-v1/christmas/2d-christmas-tree';
import christmasTree3D from './рrograms/scenes-v1/christmas/3d-christmas-tree';
import SnowFall from './рrograms/scenes-v1/christmas/snow'

import ChristmasScene from './рrograms/scenes-v2/christmas-scene'

export enum v1ProgramDemoType {
  TRIANGLE,
  SIN_WAVE,
  XMAS_2D,
  XMAS_3D,
  SNOW_FALL,
}

export enum v2ProgramDemoType {
  XMAS_SCENE_ADVANCED
}

const demoDirectory = {
  v1: {
    [v1ProgramDemoType.TRIANGLE]: TriangleDemo,
    [v1ProgramDemoType.SIN_WAVE]: SinWave,
    [v1ProgramDemoType.XMAS_2D]: christmasTree2D,
    [v1ProgramDemoType.XMAS_3D]: christmasTree3D,
    [v1ProgramDemoType.SNOW_FALL]: SnowFall,
  },
  v2: {
    [v2ProgramDemoType.XMAS_SCENE_ADVANCED]: ChristmasScene
  }
}

export function makeGameLoopVersionOne(mode: v1ProgramDemoType): void {
  const demoObject = demoDirectory.v1[mode];
  const {VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE} = demoObject
  const params = initGL(VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE)
  const frame = demoObject.makeLoop(params);
  
  function gameLoop() {
    frame()
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

export function makeGameLoopVersionTwo(mode: v2ProgramDemoType): void {
  const run = demoDirectory.v2[mode];
  run()
}