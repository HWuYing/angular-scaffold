import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

export class BaseQuestion {
  public key: string;
  public name: string;
  public props: object;
  public validate: any[];
  public propsKey: string;
  public fieldDecorator: object;
  protected isAddFormConstrolName: boolean = true;
  protected value: any;
  protected _ngModelChange: any;
  protected privateProps: string;
  protected propsExclude: string[] = [];
  protected format: (value: any) => any | void;
  protected constrolKey: string;
  constructor(key: string, propsKey: string, props: any) {
    const { name, format, ...config } = props;
    this.key = key;
    this.name = name;
    this.format = format;
    this.propsKey = propsKey;
    this.props = this.initProps(config || {}, !!format);
    this._ngModelChange = props['(ngModelChange)'] || (() => {});
    this.privateProps = `serialization.serializationProps['${this.propsKey}']`;
  }

  /**
   * 初始化配置信息
   * @param config 配置
   * @param isFormat 是否格式化值
   */
  private initProps(config: any, isFormat: boolean): object {
    return Object.assign(
      {},
      config,
      isFormat
        ? {
            '(ngModelChange)': ($event: any, constrol?: FormControl) => this.ngModelChange($event, constrol),
          }
        : {}
    );
  }

  /**
   * form数据改变时change
   * @param value value
   */
  private ngModelChange(value: any, constrol?: FormControl) {
    const { format } = this;
    if (this.value === value) {
      return;
    }
    const { _ngModelChange } = this;
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
  private parsetPropsValue(key: string, _value: any): any {
    const typeString = typeof _value;
    let value = `${this.privateProps}['${key}']`;
    switch (typeString) {
      case 'function':
        /^\([\s\S]*\)$/.test(key) ? (value = `${value}($event${this.constrolKey ? `, ${this.constrolKey}` : ''})`) : (value = value);
        break;
      case 'number':
      case 'boolean':
        value = _value;
        break;
      case 'string':
        value = `'${_value}'`;
        break;
    }
    return value;
  }

  /**
   * 拼接props 对应的属性 或者指令 事件
   */
  public serializationProps(): string {
    const { props, name, isAddFormConstrolName } = this;
    return Object.keys(props)
      .reduce(
        (propsArr: any[], key: string) => {
          if (!this._isExcludeKey(key)) {
            const bindKey = this.parsePropsKey(key);
            propsArr.push(`${bindKey}="${this.parsetPropsValue(key, props[key])}"`);
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

  public setFormConstrolKey(constrolKey: string) {
    this.constrolKey = constrolKey;
  }

  /**
   * 是否对key进行特殊处理
   * @param key string
   */
  private _isNotDealKey(key: string): boolean {
    return ['disabled'].includes(key) || /(^\[[\S\s]+\]$)|(^\([\s\S]+\)$)/.test(key);
  }

  /**
   * 是否排除对key进行序列化
   * @param key string
   */
  private _isExcludeKey(key: string): boolean {
    return this.propsExclude.includes(key);
  }
}
