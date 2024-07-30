import Camera from './Camera.js';

import Road from './Road.js';

import ControlPanel from './utils/ControlPanel.js';
import Car from './Car.js';
import Traffic from './Traffic.js';
import IO from './IO.js';
import NeuralNetwork from './NeuralNetwork.js';
import { MUTATION_RATE, N_CARS } from './utils/constants.js';

const carCanvas = document.getElementById('canvas')! as HTMLCanvasElement;
const carCtx = carCanvas.getContext('2d')!;

const nnCanvas = document.getElementById('nn-canvas')! as HTMLCanvasElement;
const nnCtx = nnCanvas.getContext('2d')!;

const saveButton = document.getElementById('save')!;
const discardButton = document.getElementById('discard')!;

saveButton.onclick = () => IO.save(bestCar);
discardButton.onclick = () => IO.discard();

const road = new Road();

const N = N_CARS;
let cars: Car[] = Traffic.generateAICars(N);

if (localStorage.getItem('nn')) {
  cars.forEach((car, i) => {
    const nn = NeuralNetwork.fromJSON(localStorage.getItem('nn')!);
    car.setNeuralNetwork(nn);
    if (i !== 0) {
      NeuralNetwork.mutate(car.getNeuralNetwork(), MUTATION_RATE);
    }
  });
}
let bestCar = cars[0];

// ============== Traffic ===============
const traffic = new Traffic(bestCar, road, 1);

const camera = new Camera(bestCar, carCtx, carCanvas, nnCtx, nnCanvas);

new ControlPanel(bestCar, bestCar.getParameter('sensor'), road, camera);

function animate(time: number): void {
  // filter destroyed cars
  cars.forEach((car, i) => {
    // prettier-ignore
    if (
      car.isDestroyed() || 
      Math.abs(car.getPosition().y - bestCar.getPosition().y) > 1000
    ) {
      cars.splice(i, 1);
      if (cars.length % 10 == 0) {
        console.log('Cars: ', cars.length);
      }
    }
  });

  // ============== Traffic ===============
  traffic.update(...road.getHitbox());
  traffic.setReferenceCar(bestCar);

  // ============== AI Cars ===============
  // AI CARS
  cars.forEach((cars) => {
    cars.update(...road.getHitbox(), ...traffic.getHitbox());
  });

  // ============= Save Ctx ===============
  carCtx.save();

  // ========= Update the camera ==========
  bestCar = cars.find((car) => {
    return (
      car.getPosition().y ===
      Math.min(
        ...cars.map((car) => {
          return car.getPosition().y;
        }),
      )
    );
  })!;
  camera.update(bestCar.getPosition().y);
  camera.setCar(bestCar);

  // ================ Draw ================
  road.draw(carCtx);
  traffic.draw(carCtx);
  transparent(() => cars.forEach((car) => car.draw(carCtx)));
  bestCar.draw(carCtx, 'blue');

  // ============ Restore Ctx =============
  carCtx.restore();

  // ======= Request the next frame =======
  requestAnimationFrame((t) => animate(t % 1000));
}

requestAnimationFrame(animate);

function transparent(callback: () => void): void {
  carCtx.globalAlpha = 0.2;
  callback();
  carCtx.globalAlpha = 1;
}
