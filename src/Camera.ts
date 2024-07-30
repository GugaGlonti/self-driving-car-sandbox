import Car from './Car.js';
import { LOWER_BOUND, UPPER_BOUND } from './utils/constants.js';
import { Controlable } from './utils/ControlPanel.js';
import { Parameter } from './utils/types.js';
import Visualizer from './Visualizer.js';

export default class Camera implements Controlable {
  private car: Car;
  private carCtx: CanvasRenderingContext2D;
  private carCanvas: HTMLCanvasElement;

  private nnCtx: CanvasRenderingContext2D;
  private nnCanvas: HTMLCanvasElement;

  private upperBound = UPPER_BOUND;
  private lowerBound = LOWER_BOUND;

  constructor(
    car: Car,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    nnCtx: CanvasRenderingContext2D,
    nnCanvas: HTMLCanvasElement,
  ) {
    this.carCanvas = canvas;
    this.carCtx = ctx;
    this.nnCanvas = nnCanvas;
    this.nnCtx = nnCtx;

    this.car = car;
  }

  public setCar(car: Car): void {
    this.car = car;
  }

  public update(maxHeight?: number): void {
    this.resizeCanvas();

    this.carCtx.save();
    const factor = Math.abs(this.car.getAngle()) / Math.PI;
    const yTranslation =
      (window.innerHeight / 2) * this.easeInOut(this.convertRange(factor));

    let { x, y } = this.car.getPosition();
    const { width, height } = this.carCanvas;

    if (maxHeight !== undefined) {
      y = maxHeight;
    }

    // prettier-ignore
    this.carCtx.translate(
      width / 2 - x,
      height * (3 / 4) - y - yTranslation);

    Visualizer.drawNetwork(this.nnCtx, this.car.getNeuralNetwork());
  }

  private resizeCanvas(): void {
    this.carCanvas.width = window.innerWidth / 2;
    this.carCanvas.height = window.innerHeight;

    this.nnCanvas.width = window.innerWidth / 2;
    this.nnCanvas.height = window.innerHeight;
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
   * @param {number} x - A number in the range [lowerBound, upperBound]
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
        default: UPPER_BOUND,
      },
      {
        name: 'lowerBound',
        value: this.lowerBound,
        min: 0,
        max: 1,
        step: 0.01,
        default: LOWER_BOUND,
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
