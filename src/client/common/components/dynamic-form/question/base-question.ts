import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GenerateProps } from './generate-props';

export class BaseQuestion extends GenerateProps {
  public key: string;
  public name: string;
  public props: object;
  public propsKey: string;
  public privateProps: string;
  protected isAddFormControlName: boolean = true;
  protected value: any;
  protected underNgModelChange: any;
  protected format: (value: any) => any | void;
  protected controlKey: string;
  constructor(key: string, propsKey: string, props: any) {
    super({ isShow: props. isShow });
    const { name, format, isShow, ...config } = props;
    this.key = key;
    this.format = format;
    this.propsKey = propsKey;
    this.name = name;
    this.props = this.initProps(config || {});
    this.underNgModelChange = props['ngModelChange'] || (() => {});
    this.privateProps = `serialization.serializationProps.${this.propsKey}`;
  }

  /**
   * 初始化配置信息
   * @param config 配置
   * @param isFormat 是否格式化值
   */
  protected initProps(config: any): object {
    const format = this.format;
    const isFormat = !!format;
    const props = { ...config };
    if (isFormat) {
      props.ngModelChange = ($event: any, control?: FormControl, validateForm?: FormGroup, parentGroup?: FormGroup) =>
        this.ngModelChange($event, control, validateForm, parentGroup);
    }
    return super.initProps(props);
  }

  /**
   * form数据改变时change
   * @param value value
   */
  protected ngModelChange(value: any, control?: FormControl, validateForm?: FormGroup, parentGroup?: FormGroup) {
    const format = this.format;
    if (this.value === value) {
      return;
    }
    const underNgModelChange = this.underNgModelChange;
    const underValue = format(value);
    this.value = [null, undefined].includes(underValue) ? value : underValue;
    setTimeout(() => {
      if (control) {
        control.setValue(this.value);
      }
      underNgModelChange(this.value, control, validateForm, parentGroup);
    });
  }

/**
   * 是否显示
   * @param validateForm Form
   * @param control 控制器
   */
  protected isChangeShow(validateForm: FormGroup, control?: FormControl, parentGroup?: FormGroup): boolean {
    const isShow = super.isChangeShow(validateForm, control, parentGroup);
    this.toggerControl(
      this.generateFormControlInfo(this.initialValue, this.fb),
      !!(isShow && parentGroup),
      parentGroup
    );
    return isShow;
  }

  /**
   * 格式化key 是否需要绑定 或者事件
   * @param key string
   */
  private parsePropsKey(key: string): string {
    return this.isNotDealKey(key) ? key : `[${key}]`;
  }

  /**
   * 解析生成props value
   * @param key 指令，属性
   * @param underValue 值
   */
  protected parsetPropsValue(key: string, underValue: any): any {
    return super.parsetPropsValue(key, underValue, this.privateProps);
  }

  /**
   * 拼接props 对应的属性 或者指令 事件
   */
  public serializationProps(): string {
    const props = this.props;
    const name = this.name;
    const isAddFormControlName = this.isAddFormControlName;
    return Object.keys(props)
      .reduce(
        (propsArr: any[], key: string) => {
          if (!this.isExcludeKey(key, props[key])) {
            const underKey = this.getTransformProps(key);
            const bindKey = this.parsePropsKey(underKey);
            propsArr.push(`${bindKey}="${this.parsetPropsValue(key, props[key])}"`);
          }
          return propsArr;
        },
        name && isAddFormControlName ? [`formControlName="${name}"`] : []
      )
      .join(' ');
  }

  public getAttr(key: string) {
    return this.props[key];
  }

  public getTemplate(): string {
    return ``;
  }

  /**
   * 获取ngIf 显示隐藏信息
   */
  public getIsShowTemplate() {
    return super.getIsShowTemplate(this.props, this.privateProps);
  }

   /**
   * @param field 值
   * @param initialValue 默认值
   * @param fb 获取
   */
  public generateFormControlInfo(field: any, fb?: FormBuilder) {
    const name = this.name;
    this.fb = fb;
    const disabled = (this.props as any).disabled;
    let value = field || field === 0 || field === '' ? field : this.initialValue;
    if (disabled) {
      value = { value, disabled };
    }
    return name ? { [name]: [value, (this.controlValidate || []).map((val: any) => val.patter)] } : {};
  }

  /**
   * 是否对key进行特殊处理
   * @param key string
   */
  private isNotDealKey(key: string): boolean {
    return ['disabled'].includes(key) || /(^\[[\S\s]+\]$)|(^\([\s\S]+\)$)|(^\*[\s\S]+$)/.test(key);
  }
}
