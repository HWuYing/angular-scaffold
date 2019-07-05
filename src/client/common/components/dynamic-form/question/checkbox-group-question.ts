import { BaseQuestion } from './base-question';

export class CheckboxGroupQuestion extends BaseQuestion {
  public getTemplate(): string {
    return `<nz-checkbox-group ${this.serializationProps()}></nz-checkbox-group>`;
  }
}
