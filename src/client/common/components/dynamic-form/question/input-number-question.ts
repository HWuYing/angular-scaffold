import { BaseQuestion } from './base-question';

export class InputNumberQuestion extends BaseQuestion {
  public getTemplate(): string {
    return `<nz-input-number style="width: 100%" ${this.serializationProps()}></nz-input-number>`;
  }
}
