import { BaseQuestion } from './base-question';

export class ButtonQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    const { ...other } = props;
    super(key, propsKey, other);
    this.propsExclude = ['text'];
    this.isAddFormConstrolName = false;
  }

  public getTemplate(): string {
    const text = this.controlKey && this.name ? this.controlKey + '.value' : `${this.privateProps}.text`;
    return `<button nz-button ${this.serializationProps()}>{{ ${text} }}</button>`;
  }
}
