import ControlPanel from './utils/ControlPanel.js';
import Camera from './Camera.js';
import Car from './car.js';
import Road from './road.js';
import Player from './utils/Player.js';

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const road = new Road();
const player = new Player();

const traffic = [new Car()];

const camrea = new Camera(player, ctx, canvas);

new ControlPanel(player, player.getParameter('sensor'), road, camrea);

function animate() {
  // update
  player.update(road.getBorders());
  traffic.forEach(car => car.update(road.getBorders()));
  ctx.save();
  camrea.update();

  // draw
  road.draw(ctx);
  player.draw(ctx);
  traffic.forEach(car => car.draw(ctx));

  // restore
  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
