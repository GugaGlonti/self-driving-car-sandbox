export default class NetworkLayer {
  private inputs: number[];
  private outputs: number[];
  private biases: number[];
  private weights: number[][] = [];

  constructor(inputLength: number, outputLength: number) {
    this.inputs = new Array(inputLength);
    this.outputs = new Array(outputLength);
    this.biases = new Array(outputLength);

    this.randomizeLayer();
  }

  public getPackedData() {
    return {
      inputs: this.inputs,
      outputs: this.outputs,
      biases: this.biases,
      weights: this.weights,
    };
  }

  public feedForward(inputs: number[]) {
    this.inputs = inputs;

    this.outputs = this.weights.map((_, i) => {
      const sum = this.inputs.reduce((acc, input, j) => {
        return acc + input * this.weights[i][j];
      }, 0);
      return sum > this.biases[i] ? 1 : 0;
    });

    return this.outputs;
  }

  private randomWeight() {
    return Math.random() * 2 - 1;
  }

  private randomizeLayer() {
    for (let i = 0; i < this.outputs.length; i++) {
      this.biases[i] = this.randomWeight();
      this.weights[i] = new Array(this.inputs.length);
      for (let j = 0; j < this.inputs.length; j++) {
        this.weights[i][j] = this.randomWeight();
      }
    }
  }
}
