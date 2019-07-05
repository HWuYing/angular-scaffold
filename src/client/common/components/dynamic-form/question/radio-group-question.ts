import { BaseQuestion } from './base-question';

export class RadioGroupQuestion extends BaseQuestion {
  private children: any[];
  constructor(key: string, propsKey: string, props: any) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.children = children || [];
  }

  public getTemplate(): string {
    let template = `<nz-radio-group ${this.serializationProps()}>`;
    this.children.forEach((child: any) => {
      template += `<label nz-radio nzValue="${child.value}">${child.label}</label>`;
    });
    template += `</nz-radio-group>`;
    return template;
  }
}
