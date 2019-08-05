import { BaseQuestion } from './base-question';

export class ContainerQuestion extends BaseQuestion {
  protected templateName: string;
  constructor(key: string, propsKey: string, props: any) {
    const { template, ...config } = props;
    super(key, propsKey, config);
    this.templateName = template;
  }
  public getTemplate(): string {
    const paramsObject = this.getParamsObject();
    return `<ng-container *ngTemplateOutlet="templateMap.${this.templateName};context: ${paramsObject}"></ng-container>`;
  }
}
