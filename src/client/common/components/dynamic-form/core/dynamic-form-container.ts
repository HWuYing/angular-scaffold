import { FormBuilder } from '@angular/forms';
import { DynamicLayout } from './dynamic-layout';
import { SerializationBase } from './serialization-base';

export class DyanmicFormContainer extends SerializationBase {
  private templateName: string;
  public children: any[];
  private dynamicLayout: DynamicLayout;
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { template, type, decorator } = config;
    super(layout);
    this.type = type;
    this.templateName = template;
    this.propsKey = propsKey;
    this.decorator = decorator || [];
    this.setParentSerialization(parentSerialization);
    this.children = this.serialization(config);
    this.dynamicLayout = new DynamicLayout({ ...layout, ...config }, this.children);
  }

  /**
   * 序列化配置
   */
  protected serialization(config?: any): any[] {
    const children = super.serialization(config);
    this.parentSerialization.privateInitialValue = {
      ...this.parentSerialization.initialValues,
      ...this.initialValues
    };
    return children;
  }

  /**
   * 获取模版
   */
  getTemplate() {
    const isChildren = !!this.children.length;
    const template = [`<ng-container *ngTemplateOutlet="templateMap.${this.templateName};context: ${this.getTemplateContext(isChildren ? `content: ${this.propsKey}_children_template,` : '')}"></ng-container>`];
    if (isChildren) {
      template.push(`<ng-template #${this.propsKey}_children_template>`);
      template.push(this.dynamicLayout.getChildrenTemplate());
      template.push(`</ng-template>`);
    }
    return template.join(``);
  }

  /**
   * 创建响应式控制器
   * @param fileStore 外部数据
   * @param fb FormBuilder
   */
  public generateFormControlName(fileStore: any, fb: FormBuilder) {
    const defFileStore = { ...this.initialValues, ...fileStore };
    return this.children.reduce((o: object, form: any) => ({
      ...o,
      ...form.generateFormControlName(form.name ? defFileStore[form.name] : defFileStore, fb)
    }), {});
  }
}
