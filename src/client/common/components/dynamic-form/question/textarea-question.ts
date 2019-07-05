import { InputQuestion } from './input-question';

export class TextareaQuestion extends InputQuestion {
  public getTemplate(): string {
    return `<textarea nz-input ${this.serializationProps()}></textarea>`;
  }
}
