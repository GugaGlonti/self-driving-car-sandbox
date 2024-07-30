import Camera from './Camera.js';

import Road from './Road.js';

import ControlPanel from './utils/ControlPanel.js';
import Car from './Car.js';
import Traffic from './Traffic.js';

const carCanvas = document.getElementById('canvas')! as HTMLCanvasElement;
const carCtx = carCanvas.getContext('2d')!;

const nnCanvas = document.getElementById('nn-canvas')! as HTMLCanvasElement;
const nnCtx = nnCanvas.getContext('2d')!;

const road = new Road();
const traffic = new Traffic([new Car()]);

const N = 100;
const cars = Traffic.generateAICars(N);

const camera = new Camera(cars[0], carCtx, carCanvas, nnCtx, nnCanvas);

new ControlPanel(cars[0], cars[0].getParameter('sensor'), road, camera);

function animate(time: number): void {
  // filter destroyed cars
  cars.forEach((car, i) => {
    if (car.isDestroyed()) {
      cars.splice(i, 1);
    }
  });

  // ============== Traffic ===============
  traffic.update(...road.getHitbox());

  // ============== AI Cars ===============
  // AI CARS
  cars.forEach(cars => {
    cars.update(...road.getHitbox(), ...traffic.getHitbox());
  });

  // ============= Save Ctx ===============
  carCtx.save();

  // ========= Update the camera ==========
  const bestCar = cars.find(car => {
    return (
      car.getPosition().y ===
      Math.min(
        ...cars.map(car => {
          return car.getPosition().y;
        })
      )
    );
  })!;
  camera.update(bestCar.getPosition().y);
  camera.setCar(bestCar);

  // ================ Draw ================
  road.draw(carCtx);
  traffic.draw(carCtx);
  transparent(() => cars.forEach(car => car.draw(carCtx)));
  bestCar.draw(carCtx, 'blue');

  // ============ Restore Ctx =============
  carCtx.restore();

  // ======= Request the next frame =======
  requestAnimationFrame(t => animate(t % 1000));
}

requestAnimationFrame(animate);

function transparent(callback: () => void): void {
  carCtx.globalAlpha = 0.2;
  callback();
  carCtx.globalAlpha = 1;
}
