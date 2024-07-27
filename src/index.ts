import Car from './car.js';
import Controls from './controls.js';

import Road from './road.js';
import Sensor from './sensor.js';

import { ROAD_WIDTH } from './utils/constants.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
canvas.width = ROAD_WIDTH;

const ctx = canvas.getContext('2d')!;

const road = new Road();
const controls = new Controls();
const car = new Car(controls);

function animate() {
  car.update();

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.getPosition().y + window.innerHeight * 0.75);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
