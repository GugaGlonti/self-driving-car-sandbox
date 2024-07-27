import { Parameter } from './types.js';

export interface Controlable {
  setParameter(name: string, value: number): void;
  getParameter(name: string): number;
  getParameters(): Parameter[];
}

export class ControlPanel {
  private panel: HTMLElement = document.getElementById('controls')!;
  private parameters: Parameter[] = [];

  constructor(...controlables: Controlable[]) {
    controlables.forEach(controlable => {
      this.parameters.push(...controlable.getParameters());
    });

    this.drawPanel();

    controlables.forEach(controlable => {
      this.addEventListeners(controlable);
    });
  }

  private addEventListeners(obj: Controlable) {
    const params = obj.getParameters();

    params.forEach(({ name }) => {
      const input = document.getElementById(name) as HTMLInputElement;

      input.addEventListener('input', () => {
        obj.setParameter(name, parseFloat(input.value));
        input.nextElementSibling!.textContent = `${name}: ${input.value}`;
      });
    });
  }

  private drawPanel() {
    this.panel.innerHTML = `

      ${this.parameters.map(({ name, value, min, max, step }) => {
        return `
          <div class="option">
            <label for="${name}">${name}</label>
            <input
              id="${name}"
              type="range"
              min="${min}"
              max="${max}"
              step="${step}"
              value="${value}"
            />
            <span>${name}: ${value}</span>
          </div>
        `;
      })}
      

      <hr />

      <button id="reset">Reset</button>
    `;
  }
}
