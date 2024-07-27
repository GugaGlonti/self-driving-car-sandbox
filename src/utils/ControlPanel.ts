import { Parameter } from './types.js';

export interface Controlable {
  setParameter(name: string, value: number): void;
  getParameter(name: string): number;
  getParameters(): Parameter[];
}

export class ControlPanel {
  private panel: HTMLElement = document.getElementById('controls')!;
  private parameters: Parameter[] = [];
  private closed = true;
  private controlables: Controlable[] = [];

  constructor(...controlables: Controlable[]) {
    this.controlables = controlables;

    this.controlables.forEach(controlable => {
      this.parameters.push(...controlable.getParameters());
    });

    this.drawPanel();
  }

  private addEventListeners(obj: Controlable) {
    const params = obj.getParameters();

    params.forEach(({ name }) => {
      const input = document.getElementById(name) as HTMLInputElement;

      input.addEventListener('input', () => {
        obj.setParameter(name, parseFloat(input.value));
        input.nextElementSibling!.textContent = `${name}: ${this.round(input.value)}`;
      });
    });
  }

  private round(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    return Math.round(value * 100) / 100;
  }

  private drawPanel() {
    if (this.closed) {
      this.drawClosedPanel();
    } else {
      this.drawOpenPanel();
      this.controlables.forEach(controlable => {
        this.addEventListeners(controlable);
      });
    }
  }

  private drawClosedPanel() {
    this.panel.innerHTML = `
      <button id="open">Open</button>
    `;

    document.getElementById('open')!.addEventListener('click', () => {
      this.closed = false;
      this.drawPanel();
    });
  }

  private drawOpenPanel() {
    this.panel.innerHTML = `
      <button id="close">Close</button>

      ${this.parameters.map(({ name, value, min, max, step }) => {
        return `
          <div class="option">
            <label for="${name}">${name}</label>
            <input id="${name}" min="${min}" max="${max}" step="${step}" value="${value}" type="range"/>
            <span>${name}: ${this.round(value)}</span>
          </div>
        `;
      })}
    `;

    document.getElementById('close')!.addEventListener('click', () => {
      this.closed = true;
      this.drawPanel();
    });
  }
}
