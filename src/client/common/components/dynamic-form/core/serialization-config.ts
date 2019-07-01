import { SerializationBase } from './serialization-base';
import { DynamicFormItem } from './dynamic-form-item';
import { DynamicLayout } from './dynamic-layout';
import { DynamicFormGroup } from './dynamic-form-group';
import { DyanmicFormArray } from './dynamic-form-array';

export class SerializationConfig extends SerializationBase {
  public config: any;
  public serializationConfig: any;
  /**
   * @param config 表单配置项
   * @param layout 表单布局 默认为每行3个
   */
  constructor(config: any, layout?: any) {
    super(layout);
    this.config = config;
    this.layout = layout;
    this.serializationConfig = this.serialization(config);
  }

  /**
   * 序列号配置 外部调用
   * @param config 表单配置项
   */
  public serialization(config: any): any {
    const { layout } = this;
    this.serializationProps = {};
    this.serializationFormItem = [];
    this.types = [];
    const serialization = this._serialization(config, 'props');
    return new DynamicLayout({ col: layout && layout.col ? layout.col : 3 }, serialization);
  }

  /**
   * 序列号配置项节点
   * @param propsKey string
   * @param item configItem
   */
  _serializationItemConfig(propsKey: string, item: any): any {
    let exp: DynamicFormItem | DynamicLayout | DynamicFormGroup | DyanmicFormArray;
    if (this._isDynamicFormGroup(item)) {
      // 是formgroup
      exp = new DynamicFormGroup(this.layout, propsKey, item, this);
    } else if (this._isDyanmicFormArray(item)) {
      // 是formArray
      exp = new DyanmicFormArray(this.layout, propsKey, item, this);
    } else {
      exp = super._serializationItemConfig(propsKey, item);
    }
    return exp;
  }

  /**
   * 生成template
   */
  public generateTemplate(): string {
    const { nzLayout } = this.layout;
    let template = `<form nz-form ${nzLayout ? `nzLayout="${nzLayout}"` : ''} (ngSubmit)="onSubmit($event)" [formGroup]="validateForm" autocomplete="off">`;
    template += this.serializationConfig.getTemplate();
    template += `</form>`;
    return template;
  }
}
