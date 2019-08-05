import { FormBuilder } from '@angular/forms';
import { DynamicLayout } from './dynamic-layout';
import { SerializationBase } from './serialization-base';

export class DynamicFormGroup extends SerializationBase {
  private privateInitialValues: any;
  public children: any[];
  public dynamicLayout: DynamicLayout;
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { type, props = {}, decorator, layout: itemLayout, fieldDecorator = {} } = config;
    super({ ...layout, ...itemLayout });
    this.decorator = decorator;
    this.type = type;
    this.name = props.name;
    this.propsKey = propsKey;
    this.privateInitialValues = fieldDecorator.initialValue;
    this.setParentSerialization(parentSerialization);
    this.children = this.serialization();
    this.dynamicLayout = new DynamicLayout({
      ...layout,
      ...config
    }, this.children);
  }

  /**
   * 获取模版html
   */
  public getTemplate() {
    const template = [];
    template.push(`<ng-container formGroupName="${this.name}">`);
    template.push(this.dynamicLayout.getTemplate());
    template.push(`</ng-container>`);
    return template.join('');
  }

  /**
   * 创建响应式控制器
   * @param fileStore 外部数据
   * @param fb FormBuilder
   */
  public generateFormControlName(fileStore: any, fb: FormBuilder) {
    const name = this.name;
    return { [name]: this.generateFormGroup(fb, fileStore || this.initialValues) };
  }

  get initialValues(): object {
    return {
      ...this.privateInitialValues,
      ...this.privateInitialValue
    };
  }

  get spanCol() {
    return this.dynamicLayout.spanCol;
  }
}
