import { FormBuilder, FormGroup } from '@angular/forms';
import { getQuestion, BaseQuestion } from '../question';
import { DynamicFormItem } from './dynamic-form-item';
import { DynamicLayout } from './dynamic-layout';

const hasOwnProperty = (o: any, name: string) => Object.prototype.hasOwnProperty.call(o, name);
const objectType = (o: object) => Object.prototype.toString.call(o).replace(/^\[object ([\s\S]+)\]$/g, '$1');
export class SerializationBase {
  protected rootParent: SerializationBase;
  protected decorator: any[];
  protected parentSerialization: SerializationBase;
  protected layout: any;
  protected controlKey: string;
  public propsKey: string;
  public type: string;
  public name: any;
  public serializationFormItem: any[] = [];
  public privateInitialValue: object = {};
  public serializationProps: any = {};
  public types: string[] = [];
  constructor(layout?: any) {
    this.layout = layout || {};
  }

  /**
   * 设置父类
   * @param parentSerialization 父累
   */
  public setParentSerialization(parentSerialization: SerializationBase) {
    this.parentSerialization = parentSerialization;
    let rootParent = parentSerialization;
    while (!!rootParent.parentSerialization) {
      rootParent = rootParent.parentSerialization;
    }
    this.rootParent = rootParent;
  }

  /**
   * 是否包含类型中的一种
   * @param arr 类型数组
   */
  public typeOrInclude(arr: string | string[]): boolean {
    let underArr: any = arr;
    if (!Array.isArray(arr)) {
      underArr = [arr];
    }
    return underArr.reduce((status: boolean, type: string) => status || this.types.includes(type), false);
  }

  /**
   * 序列化配置
   */
  protected serialization(config?: any): any[] {
    const parentSerialization = this.parentSerialization;
    const name = this.name;
    const decorator = this.decorator;
    this.types = [];
    const children = this.privateSerialization(decorator, this.propsKey);
    parentSerialization.serializationProps = {
      ...parentSerialization.serializationProps,
      ...this.serializationProps
    };
    (parentSerialization as this).serializationFormItem.push(this);
    parentSerialization.privateInitialValue[name] = this.initialValues;
    return children;
  }

  /**
   * 调用父亲的序列化信息
   * @param item 配置
   */
  private isSerializationItemConfig(item: any): boolean {
    return this.isDyanmicTable(item) || this.isDyanmicFormArray(item) || this.isDynamicFormGroup(item) || this.isDyanmicContainer(item);
  }

  /**
   * 获取form控制器
   * @param isGet 是否采用get方式获取
   */
  protected getValidateFormControlName(isGet?: boolean) {
    let parentSerialization = this.parentSerialization;
    const nameArray = [];
    let isArrayControl: boolean;
    while (!!parentSerialization && !!parentSerialization.name) {
      isArrayControl = parentSerialization.type === 'formArray';
      nameArray.unshift(`${!isGet ? parentSerialization.name : `get('${parentSerialization.name}')`}
        ${isArrayControl ? `?.get(i.toString())` : ''}`);
      parentSerialization = parentSerialization.parentSerialization;
    }
    if (nameArray.length) {
      nameArray.unshift('');
    }
    return nameArray.join('?.');
  }

  /**
   * 序列化表单配置 （递归函数）
   * @param config 表单配置项
   * @param preFix 设置表单item对应值的前缀
   */
  protected privateSerialization(config: any, preFix: any): any[] {
    let underConfig = config;
    if (!underConfig) {
      return [];
    }

    if (!Array.isArray(underConfig)) {
      underConfig = [underConfig];
    }
    return underConfig.reduce((serialization: any[], item: any, index: number) => {
      const exp = this.privateSerializationItemConfig(`${preFix}_${index.toString()}`, item);
      if (exp) {
        serialization.push(exp);
        const rootParent = this.rootParent || this;
        if (!rootParent.types.includes(exp.type)) {
          rootParent.types.push(exp.type);
        }
      }
      return serialization;
    }, []);
  }

  /**
   * 序列号配置项节点
   * @param propsKey string
   * @param item configItem
   */
  protected privateSerializationItemConfig(propsKey: string, item: any): DynamicFormItem | DynamicLayout {
    let exp: DynamicFormItem | DynamicLayout;
    if (this.isSerializationItemConfig(item)) {
      // 是容器
      if (this.rootParent) {
        exp = this.rootParent.privateSerializationItemConfig.call(this, propsKey, item);
      }
    } else if (this.isDynamicLayoutConfig(item)) {
      // 是布局
      exp = new DynamicLayout({
        nzLayout: this.layout.nzLayout,
        ...item
      }, this.privateSerialization(item.decorator, propsKey) as any);
    } else {
      // 不是布局（formItem）
      const question = getQuestion(propsKey, item);
      exp = new DynamicFormItem(
        {
          layout: { ...this.layout },
          ...item
        },
        question,
        this
      );

      question.setFormControlValidate((exp as any).controlValidate);
      question.setControlInitialValue(exp.initialValue);
      question.setFormControlKey(exp.controlKey, (exp as any).controlParentKey);
      question.setIsArrayChildren(['table', 'formArray'].includes(this.type), (this as any).ngForKey);
      // 设置formItem 的name
      exp.setQuestionName(question.name);

      // 加入propsmap 最后动态模版中需要
      this.serializationProps[(question as BaseQuestion).propsKey] = (question as BaseQuestion).props;
      // 缓存formItem 代表每个form输入
      this.serializationFormItem.push(exp);
      // 配置中的初始化数据 form reset等需要
      this.addInitialValue(exp);
    }
    return exp;
  }

  /**
   * 获取响应式表单FormGroup
   * @param fb FormBuilder
   * @param fieldStore object表单初始化数据
   */
  public generateFormGroup(fb: FormBuilder, fieldStore?: object): FormGroup {
    const underFieldStore = fieldStore || {};
    return fb.group(
      this.serializationFormItem.reduce((o: object, formItem: DynamicFormItem) => {
        const { name } = formItem;
        return {
          ...o,
          ...formItem.generateFormControlName(name ? underFieldStore[name] : underFieldStore, fb)
        };
      }, {})
    );
  }

  /**
   * 添加默认的初始化数据 initialValue
   * @param formItem DynamicFormItem
   */
  private addInitialValue(formItem: DynamicFormItem): void {
    const { question } = formItem;
    if (objectType(formItem.initialValue) === 'Object') {
      Object.keys(formItem.initialValue).forEach((key: string) => {
        this.privateInitialValue[key] = formItem.initialValue[key];
      });
    } else if (question.name && ![undefined, null].includes(formItem.initialValue)) {
      this.privateInitialValue[question.name] = formItem.initialValue;
    }
  }

  /**
   * 动态布局配置
   * @param item 配置
   */
  private isDynamicLayoutConfig(item: any) {
    return hasOwnProperty(item, 'decorator');
  }

  /**
   * formGroup动态配置
   * @param item 配置
   */
  protected isDynamicFormGroup(item: any) {
    return item.type === 'formGroup';
  }

  /**
   * table动态配置
   * @param item 配置
   */
  protected isDyanmicTable(item: any) {
    return item.type === 'table';
  }

  /**
   * container动态配置
   * @param item 配置
   */
  protected isDyanmicContainer(item: any) {
    return item.type === 'container';
  }

  /**
   * formArray动态配置
   * @param item 配置
   */
  protected isDyanmicFormArray(item: any) {
    return item.type === 'formArray';
  }

  get initialValues(): object {
    return this.privateInitialValue;
  }

  get spanCol() {
    return this.layout.spanCol;
  }
}
