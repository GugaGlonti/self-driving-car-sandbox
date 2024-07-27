import Car from './car.js';
import { Controlable } from './utils/ControlPanel.js';
import { Parameter } from './utils/types.js';

export default class Camera implements Controlable {
  private car: Car;
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private upperBound = 0.2;
  private lowerBound = 0.8;

  constructor(car: Car, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.car = car;
    this.ctx = ctx;
    this.canvas = canvas;
  }

  public update() {
    this.resizeCanvas();

    this.ctx.save();
    const factor = Math.abs(this.car.getAngle()) / Math.PI;
    const yTranslation = (window.innerHeight / 2) * this.easeInOut(this.convertRange(factor));

    const { x, y } = this.car.getPosition();
    this.ctx.translate(-x + window.innerWidth / 2, -y + window.innerHeight * 0.75 - yTranslation);
  }

  private resizeCanvas() {
    // CSS might be faster
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
  }

  /**
   * Easing function to make the camera movement smoother
   * @param t - time
   * @returns eased time
   */
  private easeInOut(t: number): number {
    return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Converts a value from the range [lowerBound, upperBound] to the range [0, 1]
   * @param {number} x - A number in the range [lowerBound, upperBound]x < lowerBound or x > upperBound will return 0 or 1 respectively
   * @returns {number} The corresponding number in the range [0, 1]
   */
  private convertRange(x: number): number {
    if (x < this.upperBound) {
      return 0;
    }

    if (x > this.lowerBound) {
      return 1;
    }

    return (x - this.upperBound) / (this.lowerBound - this.upperBound);
  }

  // CONTROL PANEL

  getParameters(): Parameter[] {
    return [
      {
        name: 'upperBound',
        value: this.upperBound,
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
      {
        name: 'lowerBound',
        value: this.lowerBound,
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.8,
      },
    ];
  }

  setParameter(name: string, value: number): void {
    // @ts-ignore
    this[name] = value;
  }
  getParameter(name: string): number {
    // @ts-ignore
    return this[name];
  }
}
