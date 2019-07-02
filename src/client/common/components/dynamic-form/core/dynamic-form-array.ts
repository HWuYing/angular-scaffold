import { FormBuilder } from '@angular/forms';
import { SerializationBase } from './serialization-base';

export class DyanmicFormArray extends SerializationBase {
  private __initialValues: any;

  public children: any[];
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { type, decorator = [], props = {}, layout: itemLayout = {}, fieldDecorator = {} } = config;
    super({ ...layout, ...itemLayout });
    this.name = props.name;
    this.type = type;
    this.decorator = decorator;
    this.propsKey = propsKey;
    this.__initialValues = fieldDecorator.initialValue;
    this.parentSerialization = parentSerialization;
    this.setParentSerialization(parentSerialization);
    this.controlKey = `validateForm${this.getValidateFormControlName(true)}.get('${this.name}')`;
    this.children = this.serialization();
  }

  /**
   * 获取模版数据
   */
  public getTemplate() {
    const name = this.name;
    const controlKey = this.controlKey;
    let template = `<ng-container formArrayName="${name}">`;
    template += `<ng-container *ngFor="let constrol of ${controlKey}.controls; let i = index" [formGroupName]="i">`;
    template += this.children.reduce((_template: string, child: any) => {
      return _template + child.getTemplate();
    }, ``);
    template += `</ng-container>`;
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
    let _fileStore = fileStore;
    if (!fileStore) {
      _fileStore = this.initialValues;
    }

    if (!Array.isArray(fileStore)) {
      _fileStore = [fileStore];
    }
    return { [name]: fb.array(_fileStore.map((store: any) => this.generateFormGroup(fb, store))) };
  }

  get initialValues(): object {
    return this.__initialValues.map((store: any) => ({
      ...store,
      ...this._initialValue
    }));
  }
}
