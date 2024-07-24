import Car from './car.js';
import Controls from './controls.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;

const ctx = canvas.getContext('2d')!;

const controls = new Controls();
const car = new Car(controls);

function animate() {
  resizeCanvas();
  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}

function resizeCanvas() {
  canvas.width = 200;
  canvas.height = window.innerHeight;
}

animate();
