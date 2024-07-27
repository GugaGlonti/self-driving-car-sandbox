import ControlPanel from './utils/ControlPanel.js';
import Camera from './Camera.js';
import Car from './car.js';
import Controls from './controls.js';
import Road from './road.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const road = new Road();
const controls = new Controls();
const car = new Car(controls);
const camrea = new Camera(car, ctx, canvas);

new ControlPanel(car, car.getParameter('sensor'), road, camrea);

function animate() {
  car.update(road.getBorders());

  ctx.save();
  camrea.update();

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
