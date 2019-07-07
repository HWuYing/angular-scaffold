import { BaseQuestion } from './base-question';

export class TextQuestion extends BaseQuestion {
  private target: string;
  constructor(key: string, propsKey: string, props: any) {
    const { target, ...other } = props;
    super(key, propsKey, other);
    this.propsExclude = ['text', 'placeholder'];
    this.target = target || 'span';
    this.isAddFormControlName = false;
  }

  public getTemplate(): string {
    const text = this.controlKey && this.name ? this.controlKey + '.value' : `${this.privateProps}.text`;
    return `<${this.target} ${this.serializationProps()}>{{ ${text} }}</${this.target}>`;
  }
}
