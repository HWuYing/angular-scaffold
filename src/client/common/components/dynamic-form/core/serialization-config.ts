import { createHash  } from 'crypto';
import { DyanmicFormArray } from './dynamic-form-array';
import { DynamicFormGroup } from './dynamic-form-group';
import { DynamicFormItem } from './dynamic-form-item';
import { DynamicLayout } from './dynamic-layout';
import { DyanmicTable } from './dynamic-table';
import { SerializationBase } from './serialization-base';

export class SerializationConfig extends SerializationBase {
  public config: any;
  public underHashKey: string;
  public template: string;
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
    const layout = this.layout;
    this.serializationProps = {};
    this.serializationFormItem = [];
    this.types = [];
    const serialization = this.privateSerialization(config, 'props');
    return new DynamicLayout({ col: layout && layout.col ? layout.col : 3 }, serialization);
  }

  /**
   * 序列号配置项节点
   * @param propsKey string
   * @param item configItem
   */
  public privateSerializationItemConfig(propsKey: string, item: any): any {
    let exp: DynamicFormItem | DynamicLayout | DynamicFormGroup | DyanmicFormArray;
    if (this.isDynamicFormGroup(item)) {
      // 是formgroup
      exp = new DynamicFormGroup(this.layout, propsKey, item, this);
    } else if (this.isDyanmicFormArray(item)) {
      // 是formArray
      exp = new DyanmicFormArray(this.layout, propsKey, item, this);
    } else if (this.isDyanmicTable(item)) {
      // 是table
      exp = new DyanmicTable(this.layout, propsKey, item, this);
    } else {
      exp = super.privateSerializationItemConfig(propsKey, item);
    }
    return exp;
  }

  /**
   * 生成template
   */
  public generateTemplate(): string {
    const { nzLayout } = this.layout;
    if (this.template) {
      return this.template;
    }
    let template = `<form nz-form ${nzLayout ? `nzLayout="${nzLayout}"` : ''} (ngSubmit)="onSubmit($event)" [formGroup]="validateForm" autocomplete="off">`;
    template += this.serializationConfig.getTemplate();
    template += `</form>`;
    this.template = template;
    const md5 = createHash('md5');
    md5.update(template);
    this.underHashKey = md5.digest('hex');
    return template;
  }

  get hashKey() {
    if (!this.underHashKey) {
      this.generateTemplate();
    }
    return this.underHashKey;
  }

  /**
   * 序列化配置项
   * @param config config
   * @param layout layout
   * @param nzLayout nzLayout
   * @returns {SerializationConfig}
   */
  static factorySerializationConfig = (config: any, layout?: any, nzLayout?: string): SerializationConfig => {
    return new SerializationConfig(config, {
      nzLayout,
      ...layout
    });
  };
}
