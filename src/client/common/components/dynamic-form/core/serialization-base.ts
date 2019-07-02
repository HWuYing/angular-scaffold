import { FormBuilder, FormGroup } from '@angular/forms';
import { getQuestion, BaseQuestion } from '../question';
import { GenerateProps } from '../question/generate-props';
import { DynamicFormItem } from './dynamic-form-item';
import { DynamicLayout } from './dynamic-layout';

const hasOwnProperty = (o: any, name: string) => Object.prototype.hasOwnProperty.call(o, name);

export class SerializationBase extends GenerateProps {
  private rootParent: SerializationBase;
  protected decorator: any[];
  protected parentSerialization: SerializationBase;
  protected layout: any;
  public propsKey: string;
  public type: string;
  public name: any;
  public serializationFormItem: any[] = [];
  public _initialValue: object = {};
  public serializationProps: any = {};
  public types: string[] = [];
  constructor(layout?: any) {
    super();
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
    let _arr: any = arr;
    if (!Array.isArray(arr)) {
      _arr = [arr];
    }
    return _arr.reduce((status: boolean, type: string) => status || this.types.includes(type), false);
  }

  /**
   * 序列化配置
   */
  protected serialization(config?: any): any[] {
    const parentSerialization = this.parentSerialization;
    const name = this.name;
    const decorator = this.decorator;
    this.types = [];
    const children = this._serialization(decorator, this.propsKey);
    parentSerialization.serializationProps = {
      ...parentSerialization.serializationProps,
      ...this.serializationProps
    };
    (parentSerialization as this).serializationFormItem.push(this);
    parentSerialization._initialValue[name] = this.initialValues;
    return children;
  }

  /**
   * 调用父亲的序列化信息
   * @param item 配置
   */
  private isSerializationItemConfig(item: any): boolean {
    return this._isDyanmicFormArray(item) || this._isDynamicFormGroup(item);
  }

  /**
   * 获取form控制器
   * @param isGet 是否采用get方式获取
   */
  protected getValidateFormControlName(isGet?: boolean) {
    let parentSerialization = this.parentSerialization;
    const nameArray = [];
    let isArrayConstrol: boolean;
    while (!!parentSerialization && !!parentSerialization.name) {
      isArrayConstrol = parentSerialization.type === 'formArray';
      nameArray.unshift(`${!isGet ? parentSerialization.name : `get('${parentSerialization.name}')`}
        ${isArrayConstrol ? `?.get(i.toString())` : ''}`);
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
  protected _serialization(config: any, preFix: any): any[] {
    let _config = config;
    if (!_config) {
      return [];
    }

    if (!Array.isArray(_config)) {
      _config = [_config];
    }
    return _config.reduce((serialization: any[], item: any, index: number) => {
      const exp = this._serializationItemConfig(`${preFix}_${index.toString()}`, item);
      if (exp) {
        serialization.push(exp);
        if (this.rootParent && !this.rootParent.types.includes(exp.type)) {
          this.rootParent.types.push(exp.type);
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
  protected _serializationItemConfig(propsKey: string, item: any): DynamicFormItem | DynamicLayout {
    let exp: DynamicFormItem | DynamicLayout;
    if (this.isSerializationItemConfig(item)) {
      // 是容器
      if (this.rootParent) {
        exp = this.rootParent._serializationItemConfig.call(this, propsKey, item);
      }
    } else if (this._isDynamicLayoutConfig(item)) {
      // 是布局
      exp = new DynamicLayout(item, this._serialization(item.decorator, propsKey) as any);
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
      question.setFormControlKey(exp.controlKey);
      // 加入propsmap 最后动态模版中需要
      this.serializationProps[(question as BaseQuestion).propsKey] = (question as BaseQuestion).props;
      // 缓存formItem 代表每个form输入
      this.serializationFormItem.push(exp);
      // 配置中的初始化数据 form reset等需要
      if (question.name && ![undefined, null].includes(exp.initialValue)) {
        this._initialValue[question.name] = exp.initialValue;
      }
    }
    return exp;
  }

  /**
   * 获取响应式表单FormGroup
   * @param fb FormBuilder
   * @param fieldStore object表单初始化数据
   */
  public generateFormGroup(fb: FormBuilder, fieldStore?: object): FormGroup {
    const _fieldStore = fieldStore || {};
    return fb.group(
      this.serializationFormItem.reduce((o: object, formItem: DynamicFormItem) => {
        const { name } = formItem;
        return {
          ...o,
          ...formItem.generateFormControlName(_fieldStore[name], fb)
        };
      }, {})
    );
  }

  /**
   * 动态布局配置
   * @param item 配置
   */
  private _isDynamicLayoutConfig(item: any) {
    return hasOwnProperty(item, 'decorator');
  }

  /**
   * formGroup动态配置
   * @param item 配置
   */
  protected _isDynamicFormGroup(item: any) {
    return item.type === 'formGroup';
  }

  /**
   * formArray动态配置
   * @param item 配置
   */
  protected _isDyanmicFormArray(item: any) {
    return item.type === 'formArray';
  }

  get initialValues(): object {
    return this._initialValue;
  }

  get spanCol() {
    return this.layout.spanCol;
  }
}
