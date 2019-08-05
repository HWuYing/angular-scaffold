import { FormBuilder } from '@angular/forms';
import { DynamicLayout } from './dynamic-layout';
import { SerializationBase } from './serialization-base';

const getNgForKey = (() => {
  const keys = new Array(26).fill('')
    .map((item: any, index: number) => `ngFor${String.fromCharCode(index + 97)}`);
  let cursor = 0;
  return () => {
    const ngKey = keys[cursor];
    cursor += 1;
    if (cursor >= keys.length) {
      cursor = 0;
    }
    return ngKey;
  };
})();

export class DyanmicFormArray extends SerializationBase {
  private privateInitialValues: any;
  public ngForKey: string;
  public children: any[];
  public dynamicLayout: DynamicLayout;
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { type, decorator = [], props = {}, layout: itemLayout = {}, fieldDecorator = {} } = config;
    super({ ...layout, ...itemLayout });
    this.name = props.name;
    this.type = type;
    this.decorator = decorator;
    this.propsKey = propsKey;
    this.privateInitialValues = fieldDecorator.initialValue || [];
    this.parentSerialization = parentSerialization;
    this.setParentSerialization(parentSerialization);
    this.controlKey = `validateForm${this.getValidateFormControlName(true)}.get('${this.name}')`;
    this.ngForKey = getNgForKey();
    this.children = this.serialization(config);
    this.dynamicLayout = new DynamicLayout({ ...layout, ...config }, this.children);
  }

  /**
   * 获取模版数据
   */
  public getTemplate() {
    const ngForKey = this.ngForKey;
    const template = [];
    template.push(`<div nz-row formArrayName="${this.name}" class="dynamic-layout-${this.dynamicLayout.col}">`);
    template.push(`<ng-container *ngFor="let control of ${this.controlKey}.controls; let ${ngForKey} = index" [formGroupName]="${ngForKey}">`);
    template.push(this.dynamicLayout.getChildrenTemplate());
    template.push(`</ng-container>`);
    template.push(`</div>`);
    return template.join(``);
  }

  /**
   * 创建响应式控制器
   * @param fileStore 外部数据
   * @param fb FormBuilder
   */
  public generateFormControlName(fileStore: any, fb: FormBuilder) {
    const name = this.name;
    let underFileStore = fileStore;
    if (!fileStore) {
      underFileStore = this.initialValues;
    }

    if (!Array.isArray(underFileStore)) {
      underFileStore = [fileStore];
    }
    return { [name]: fb.array(underFileStore.map((store: any) => this.generateFormGroup(fb, store))) };
  }

  get initialValues(): object {
    return this.privateInitialValues.map((store: any) => ({
      ...this.privateInitialValue,
      ...store
    }));
  }

  get spanCol() {
    return this.dynamicLayout.spanCol;
  }
}
