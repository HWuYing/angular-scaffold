import { BaseQuestion } from './base-question';

export class InputQuestion extends BaseQuestion {
  public getTemplate(): string {
    return `<input nz-input ${this.serializationProps()}/>`;
  }
}
