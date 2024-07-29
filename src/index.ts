import Camera from './Camera.js';

import Road from './Road.js';
import Player from './utils/Player.js';

import ControlPanel from './utils/ControlPanel.js';
import Car from './Car.js';
import Traffic from './Traffic.js';
import { forEachOfBoth, mapEachOfBoth } from './utils/utilFunctions.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const road = new Road();
const traffic = new Traffic([new Car()]);
const player = new Player();

const camrea = new Camera(player, ctx, canvas);

new ControlPanel(player, player.getParameter('sensor'), road, camrea);

function animate(): void {
  // update
  traffic.update(...road.getHitbox()); // ...player.getHitbox());
  player.update(...road.getHitbox(), ...traffic.getHitbox());

  ctx.save();
  camrea.update();

  // draw
  road.draw(ctx);
  traffic.draw(ctx);
  player.draw(ctx);

  // restore
  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
