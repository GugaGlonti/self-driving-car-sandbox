import Car from './Car.js';
import NeuralNetwork from './NeuralNetwork.js';
import Road from './Road.js';
import { Colidable, Line } from './utils/types.js';

export default class Traffic implements Colidable {
  private cars: Car[] = [];
  private frequency: number;
  private road: Road;

  private referenceCar: Car;

  constructor(refferenceCar: Car, road: Road, frequency: number) {
    this.referenceCar = refferenceCar;
    this.road = road;
    this.frequency = frequency;
    this.addCarCycle();
  }

  private addCarCycle() {
    setInterval(() => {
      const { y } = this.referenceCar.getPosition();

      const lane = Math.floor(Math.random() * this.road.getLaneCount());
      const car = new Car(
        this.road.getLaneCenter(lane),
        y - 100,
        undefined,
        undefined,
        'CPU',
      );
      this.cars.push(car);
    }, this.frequency * 1000);
  }

  public update(...hitbox: Line[]) {
    this.cars.forEach((car, i) => {
      if (this.carHasBeenPassed(car)) {
        this.cars.splice(i, 1);
      }
    });
    this.cars.forEach((car) => car.update(...hitbox));
  }

  private carHasBeenPassed(car: Car) {
    const { y } = car.getPosition();
    const { y: referenceY } = this.referenceCar.getPosition();
    return y < referenceY;
  }

  public setReferenceCar(car: Car) {
    this.referenceCar = car;
  }

  public getHitbox() {
    return this.cars.flatMap((car) => car.getHitbox());
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.cars.forEach((car) => car.draw(ctx));
  }

  static generateAICars(count: number): Car[] {
    return Array.from({ length: count }, () => {
      return new Car(undefined, undefined, undefined, undefined, 'AI');
    });
  }

  static generateMutatedAICars(
    count: number,
    nn: NeuralNetwork,
    mutationRate: number,
  ): Car[] {
    const carsWithSameNN = Array.from({ length: count }, () => {
      return new Car(undefined, undefined, undefined, undefined, 'AI', nn);
    });

    carsWithSameNN.forEach((car) => {
      NeuralNetwork.mutate(car.getNeuralNetwork().copy(), mutationRate);
    });

    return carsWithSameNN;
  }
}
