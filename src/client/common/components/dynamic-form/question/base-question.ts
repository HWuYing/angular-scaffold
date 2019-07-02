import { FormControl } from '@angular/forms';
import { GenerateProps } from './generate-props';

export class BaseQuestion extends GenerateProps {
  public key: string;
  public name: string;
  public props: object;
  public validate: any[];
  public propsKey: string;
  public privateProps: string;
  public fieldDecorator: object;
  protected isAddFormConstrolName: boolean = true;
  protected value: any;
  protected _ngModelChange: any;
  protected propsExclude: string[] = ['*ngIf'];
  protected format: (value: any) => any | void;
  protected controlKey: string;
  constructor(key: string, propsKey: string, props: any) {
    super({ isShow: props. isShow });
    const { name, format, isShow, ...config } = props;
    this.key = key;
    this.name = name;
    this.format = format;
    this.propsKey = propsKey;
    this.props = this.initProps(config || {});
    this._ngModelChange = props['(ngModelChange)'] || (() => {});
    this.privateProps = `serialization.serializationProps['${this.propsKey}']`;
  }

  /**
   * 初始化配置信息
   * @param config 配置
   * @param isFormat 是否格式化值
   */
  protected initProps(config: any): object {
    const format = this.format;
    const isFormat = !!format;
    const props = {
      ...config
    };
    if (isFormat) {
      props[this.getTransformProps('ngModelChange')] = ($event: any, constrol?: FormControl) => this.ngModelChange($event, constrol);
    }
    return super.initProps(props);
  }

  /**
   * form数据改变时change
   * @param value value
   */
  protected ngModelChange(value: any, constrol?: FormControl) {
    const format = this.format;
    if (this.value === value) {
      return;
    }
    const _ngModelChange = this._ngModelChange;
    const _value = format(value);
    this.value = [null, undefined].includes(_value) ? value : _value;
    setTimeout(() => {
      if (constrol) {
        constrol.setValue(this.value);
      }
      _ngModelChange(this.value);
    });
  }

  /**
   * 格式化key 是否需要绑定 或者事件
   * @param key string
   */
  private parsePropsKey(key: string): string {
    return this._isNotDealKey(key) ? key : `[${key}]`;
  }

  /**
   * 解析生成props value
   * @param key 指令，属性
   * @param _value 值
   */
  protected parsetPropsValue(key: string, _value: any): any {
    return super.parsetPropsValue(key, _value, this.privateProps);
  }

  /**
   * 拼接props 对应的属性 或者指令 事件
   */
  public serializationProps(): string {
    const props = this.props;
    const name = this.name;
    const isAddFormConstrolName = this.isAddFormConstrolName;
    return Object.keys(props)
      .reduce(
        (propsArr: any[], key: string) => {
          if (!this._isExcludeKey(key)) {
            const _key = this.getTransformProps(key);
            const bindKey = this.parsePropsKey(_key);
            propsArr.push(`${bindKey}="${this.parsetPropsValue(_key, props[key])}"`);
          }
          return propsArr;
        },
        name && isAddFormConstrolName ? [`formControlName="${name}"`] : []
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
   * 是否对key进行特殊处理
   * @param key string
   */
  private _isNotDealKey(key: string): boolean {
    return ['disabled'].includes(key) || /(^\[[\S\s]+\]$)|(^\([\s\S]+\)$)|(^\*[\s\S]+$)/.test(key);
  }

  /**
   * 是否排除对key进行序列化
   * @param key string
   */
  private _isExcludeKey(key: string): boolean {
    return this.propsExclude.includes(key);
  }
}
