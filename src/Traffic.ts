import Car from './car.js';
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
}
