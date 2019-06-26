import { BaseQuestion } from './base-question';

export class SelectQuestion extends BaseQuestion {
  private children: any[];
  constructor(key: string, propsKey: string, props: any) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.children = children || [];
  }

  public getTemplate(): string {
    let template = `<nz-select ${this.serializationProps()}>`;
    this.children.forEach((child: any) => {
      template += `<nz-option nzLabel="${child.label}" [nzValue]="'${child.value}'"></nz-option>`;
    });
    template += `</nz-select>`;
    return template;
  }
}
