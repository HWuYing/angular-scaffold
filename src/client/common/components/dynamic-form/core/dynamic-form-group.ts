import { FormBuilder } from '@angular/forms';
import { SerializationBase } from './serialization-base';

export class DynamicFormGroup extends SerializationBase {
  private __initialValues: any;
  public children: any[];
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { type, props = {}, decorator, layout: itemLayout, fieldDecorator = {} } = config;
    super({ ...layout, ...itemLayout });
    this.decorator = decorator;
    this.type = type;
    this.name = props.name;
    this.propsKey = propsKey;
    this.__initialValues = fieldDecorator.initialValues;
    this.setParentSerialization(parentSerialization);
    this.children = this.serialization();
  }

  /**
   * 获取模版html
   */
  public getTemplate() {
    const name = this.name;
    let template = `<ng-container formGroupName="${name}">`;
    template += this.children.reduce((_template: string, child: any) => {
      return _template + child.getTemplate();
    }, ``);
    template += `</ng-container>`;
    return template;
  }

  /**
   * 创建响应式控制器
   * @param fileStore 外部数据
   * @param fb FormBuilder
   */
  public generateFormControlName(fileStore: any, fb: FormBuilder) {
    const name = this.name;
    return { [name]: this.generateFormGroup(fb, fileStore) };
  }

  get initialValues(): object {
    return {
      ...this.__initialValues,
      ...this._initialValue
    };
  }
}
