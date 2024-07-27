import linspace from './utils/linspace.js';
import { INF, ROAD_WIDTH, SHOULDER_WIDTH } from './utils/constants.js';

export default class Road {
  private x = ROAD_WIDTH / 2;
  private left = this.x - ROAD_WIDTH / 2 + SHOULDER_WIDTH;
  private right = this.x + ROAD_WIDTH / 2 - SHOULDER_WIDTH;

  private top = -INF;
  private bottom = INF;

  private laneCount: number;

  private topleft = { x: this.left, y: this.top };
  private topright = { x: this.right, y: this.top };
  private bottomleft = { x: this.left, y: this.bottom };
  private bottomright = { x: this.right, y: this.bottom };

  private borders = [
    [this.topleft, this.topright],
    [this.bottomleft, this.bottomright],
  ];

  constructor(laneCount = 3) {
    this.laneCount = laneCount;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    linspace(this.left, this.right, this.laneCount).forEach((x, i) => {
      this.chooseLine(ctx, i);
      this.drawLine(ctx, x);
    });

    this.borders.forEach(([start, end]) => {
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }

  public getLaneCenter(lane: number) {
    return linspace(this.left, this.right, this.laneCount)[lane];
  }

  private chooseLine(ctx: CanvasRenderingContext2D, i: number) {
    if (i === 0 || i === this.laneCount) {
      ctx.setLineDash([]);
    } else {
      ctx.setLineDash([30, 30]);
    }
  }

  private drawLine(ctx: CanvasRenderingContext2D, x: number) {
    ctx.beginPath();
    ctx.moveTo(x, this.top);
    ctx.lineTo(x, this.bottom);
    ctx.stroke();
  }
}
