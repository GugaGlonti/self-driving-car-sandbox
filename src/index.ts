import Car from './car.js';
import Controls from './controls.js';
import Road from './road.js';

import { ControlPanel } from './utils/ControlPanel.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;

const ctx = canvas.getContext('2d')!;

const road = new Road();
const controls = new Controls();
const car = new Car(controls);

new ControlPanel(car, car.getParameter('sensor'), road);

function animate() {
  car.update();

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  ctx.save();
  ctx.translate(0, -car.getPosition().y + window.innerHeight * 0.75);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
