import Car from './car.js';
import { linspace, drawLine, getIntersection } from './utils/utilFunctions.js';
import { Controlable } from './utils/ControlPanel.js';
import { DistancePoint, Parameter, Point, Ray } from './utils/types.js';

export default class Sensor implements Controlable {
  private car: Car;

  private rayCount = 3;
  private rayLength = 100;
  private raySpread = Math.PI / 4;

  private rays: Ray[] = [];
  private readings: (DistancePoint | undefined)[] = [];

  constructor(car: Car) {
    this.car = car;
  }

  public update(borders: [Point, Point][]) {
    this.castRays();
    this.updateReadings(borders);
  }

  private updateReadings(borders: [Point, Point][]) {
    this.readings = this.rays.map(ray => this.getReading(ray, borders));
  }

  private getReading(ray: Ray, borders: [Point, Point][]): DistancePoint | undefined {
    const touchPoints: DistancePoint[] = [];
    borders.forEach(border => {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) {
        touchPoints.push(touch);
      }
    });

    if (!touchPoints.length) {
      return undefined;
    }

    const offsets = touchPoints.map(touch => touch.offset);
    const minimumOffset = Math.min(...offsets);
    return touchPoints.find(touch => touch.offset === minimumOffset);
  }

  private castRays() {
    this.rays = [];
    const carAngle = this.car.getAngle();
    const start: Point = this.car.getPosition();

    if (this.rayCount === 1) {
      return this.rays.push([
        start,
        {
          x: start.x - Math.sin(carAngle) * this.rayLength,
          y: start.y - Math.cos(carAngle) * this.rayLength,
        },
      ]);
    }

    linspace(-this.raySpread / 2, this.raySpread / 2, this.rayCount - 1).forEach(rayAngle => {
      rayAngle += carAngle;
      return this.rays.push([
        start,
        {
          x: start.x - Math.sin(rayAngle) * this.rayLength,
          y: start.y - Math.cos(rayAngle) * this.rayLength,
        },
      ]);
    });
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;

    this.rays.forEach(([start, end], i) => {
      const reading = this.readings[i];
      if (reading) {
        drawLine(ctx, start, reading, 'yellow');
        drawLine(ctx, reading, end, 'red');
      } else {
        drawLine(ctx, start, end, 'yellow');
      }
    });
  }

  // CONTROL PANEL
  getParameters(): Parameter[] {
    return [
      {
        name: 'rayCount',
        value: this.rayCount,
        min: 1,
        max: 100,
        step: 1,
        default: 3,
      },
      {
        name: 'rayLength',
        value: this.rayLength,
        min: 1,
        max: 1000,
        step: 1,
        default: 100,
      },
      {
        name: 'raySpread',
        value: this.raySpread,
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        default: Math.PI / 4,
      },
    ];
  }

  public setParameter(param: string, value: number) {
    // @ts-ignore
    this[param] = value;
  }

  public getParameter(param: string) {
    // @ts-ignore
    return this[param];
  }
}
