import { BaseQuestion } from './base-question';

export class TextQuestion extends BaseQuestion {
  private target: string;
  constructor(key: string, propsKey: string, props: any) {
    const { target, ...other } = props;
    super(key, propsKey, other);
    this.target = target || 'span';
    this.isAddFormControlName = false;
    this.mergePropsExtends(['text', 'placeholder', this.transformProps.size]);
  }

  public getTemplate(): string {
    const text = this.controlKey && this.name ? `![undefined, null].includes(${this.controlKey}.value) ? ${this.controlKey}.value : ${this.privateProps}.text` : `${this.privateProps}.text`;
    return `<${this.target} class="text-question" ${this.serializationProps()}>{{ ${text} }}</${this.target}>`;
  }
}
