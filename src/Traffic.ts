import Car from './Car.js';
import NeuralNetwork from './NeuralNetwork.js';
import { Colidable, Line } from './utils/types.js';

export default class Traffic implements Colidable {
  private cars: Car[] = [];

  constructor(cars: Car[]) {
    this.cars = cars;
  }

  public getHitbox() {
    return this.cars.flatMap(car => car.getHitbox());
  }

  public update(...hitbox: Line[]) {
    this.cars.forEach(car => car.update(...hitbox));
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.cars.forEach(car => car.draw(ctx));
  }

  static generateAICars(count: number): Car[] {
    return Array.from({ length: count }, () => {
      return new Car(undefined, undefined, undefined, undefined, 'AI');
    });
  }

  static generateMutatedAICars(count: number, nn: NeuralNetwork, mutationRate: number): Car[] {
    const carsWithSameNN = Array.from({ length: count }, () => {
      return new Car(undefined, undefined, undefined, undefined, 'AI', nn);
    });

    carsWithSameNN.forEach(car => {
      NeuralNetwork.mutate(car.getNeuralNetwork().copy(), mutationRate);
    });

    return carsWithSameNN;
  }
}
