import { initGL } from './general/core-utils';
import triangleDemo from './рrograms/scenes-v1/triangle';
import sinWave from './рrograms/scenes-v1/sin-wave';
import christmasTree2D from './рrograms/scenes-v1/christmas/2d-christmas-tree';
import christmasTree3D from './рrograms/scenes-v1/christmas/3d-christmas-tree';
import snowFall from './рrograms/scenes-v1/christmas/snow'

import christmasScene from './рrograms/scenes-v2/christmas-scene'
import sceneViewer from './рrograms/scenes-v1/scene-viewer';

export enum v1ProgramDemoType {
  /**
   * Hello Triangle.
   */
  TRIANGLE,

  /**
   * first attempt at using more fragment functionality.
   */
  SIN_WAVE,

  /**
   * 2d xmas tree, super basic
   */
  XMAS_2D,

  /**
   * 3d xmas tree with some lights. 
   */
  XMAS_3D,

  /**
   * Demo in which I aim to show snow, falling.
   */
  SNOW_FALL,

  /**
   * try out of a way in which all demos are put in one gl context, and interactively can be switched between.
   */
  SCENE_VIEWER
}

export enum v2ProgramDemoType {
  XMAS_SCENE_ADVANCED
}

const demoDirectory = {
  v1: {
    [v1ProgramDemoType.TRIANGLE]: triangleDemo,
    [v1ProgramDemoType.SIN_WAVE]: sinWave,
    [v1ProgramDemoType.XMAS_2D]: christmasTree2D,
    [v1ProgramDemoType.XMAS_3D]: christmasTree3D,
    [v1ProgramDemoType.SNOW_FALL]: snowFall,
    [v1ProgramDemoType.SCENE_VIEWER]: sceneViewer
  },
  v2: {
    [v2ProgramDemoType.XMAS_SCENE_ADVANCED]: christmasScene
  }
}

export function makeGameLoopVersionOne(mode: v1ProgramDemoType): void {
  const demoObject = demoDirectory.v1[mode];
  const {VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE} = demoObject

  const canvas = document.createElement('canvas')
  canvas.id = 'canvas'
  document.getElementById('root')!.appendChild(canvas)

  const params = initGL(canvas, VERTEX_SHADER_SOURCE_CODE, FRAGMENT_SHADER_SOURCE_CODE)
  const frame = demoObject.makeLoop(params);

  function loop() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    frame(performance.now())
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

export function makeGameLoopVersionTwo(mode: v2ProgramDemoType): void {
  const run = demoDirectory.v2[mode];
  run()
}