import { BaseQuestion } from './base-question';

export class CheckBoxQuestion extends BaseQuestion {
  private text: string;
  constructor(key: string, propsKey: string, props: any) {
    const { text, ...config } = props;
    super(key, propsKey, config);
    this.text = text;
  }

  public getTemplate(): string {
    return `<label nz-checkbox ${this.serializationProps()}>${this.text}</label>`;
  }
}
