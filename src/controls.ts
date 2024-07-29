import { DOWN, LEFT, RIGHT, UP } from './utils/constants.js';

export default class Controls {
  public forward = false;
  public reverse = false;
  public left = false;
  public right = false;

  constructor(isPlayer: boolean) {
    if (isPlayer) {
      this.addKeyListeners();
    } else {
      this.forward = true;
    }
  }

  private addKeyListeners(): void {
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case UP:
          this.forward = true;
          break;
        case DOWN:
          this.reverse = true;
          break;
        case LEFT:
          this.left = true;
          break;
        case RIGHT:
          this.right = true;
          break;
      }
    });

    document.addEventListener('keyup', event => {
      switch (event.key) {
        case UP:
          this.forward = false;
          break;
        case DOWN:
          this.reverse = false;
          break;
        case LEFT:
          this.left = false;
          break;
        case RIGHT:
          this.right = false;
          break;
      }
    });
  }
}
