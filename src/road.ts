import linspace from './utils/linspace.js';
import { INF, ROAD_WIDTH, SHOULDER_WIDTH } from './utils/constants.js';

export default class Road {
  private x = ROAD_WIDTH / 2;
  private left = this.x - ROAD_WIDTH / 2 + SHOULDER_WIDTH;
  private right = this.x + ROAD_WIDTH / 2 - SHOULDER_WIDTH;
  private top = -INF;
  private bottom = INF;
  private laneCount: number;

  constructor(laneCount = 3) {
    this.laneCount = laneCount;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    linspace(this.left, this.right, this.laneCount).forEach((x, i) => {
      this.chooseLine(ctx, i);
      this.drawLine(ctx, x);
    });
  }

  private chooseLine(ctx: CanvasRenderingContext2D, i: number) {
    if (i === 0 || i === this.laneCount) {
      ctx.lineWidth = 5;
    } else {
      ctx.lineWidth = 2;
    }
  }

  private drawLine(ctx: CanvasRenderingContext2D, x: number) {
    ctx.beginPath();
    ctx.moveTo(x, this.top);
    ctx.lineTo(x, this.bottom);
    ctx.stroke();
  }
}
