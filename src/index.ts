import Car from './car.js';
import Controls from './controls.js';
import Road from './road.js';

import { ROAD_WIDTH } from './utils/constants.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
canvas.width = ROAD_WIDTH;

const ctx = canvas.getContext('2d')!;

const road = new Road();
const controls = new Controls();
const car = new Car(controls);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);
  requestAnimationFrame(animate);
}
