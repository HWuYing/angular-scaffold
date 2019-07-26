import { SerializationBase } from './serialization-base';

export class DyanmicFormContainer extends SerializationBase {
  private templateName: string;
  constructor(layout: any, propsKey: string, config: any) {
    const { template, type } = config;
    super(layout);
    this.type = type;
    this.templateName = template;
  }

  /**
   * 序列化配置
   */
  protected serialization(config?: any): any[] {
    return [];
  }

  getTemplate() {
    return `<ng-container *ngTemplateOutlet="templateMap.${this.templateName};context:{$implicit: validateForm}"></ng-container>`;
  }
}
