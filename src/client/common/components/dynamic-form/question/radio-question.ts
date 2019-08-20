import { BaseQuestion } from './base-question';

export class RadioQuestion extends BaseQuestion {
  private text: string;
  constructor(key: string, propsKey: string, props: any) {
    const { text, ...config } = props;
    super(key, propsKey, config);
    this.text = text;
    this.mergePropsExtends(this.transformProps.size);
  }

  public getTemplate(): string {
    return `<label nz-radio ${this.serializationProps()}>${this.text}</label>`;
  }
}
