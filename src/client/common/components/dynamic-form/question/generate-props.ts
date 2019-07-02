import { FormControl, FormGroup } from '@angular/forms';

export class GenerateProps {
  protected isShow: boolean;
  protected transformProps: any = {
    ngModelChange: '(ngModelChange)',
    style: '[ngStyle]',
    class: '[ngClass]',
    isShow: '*ngIf'
  };
  protected controlKey: string;
  constructor(defaultProps?: any) {
    const _defaultProps = defaultProps || {};
    this.isShow = _defaultProps.isShow;
  }

  /**
   * 解析生成props value
   * @param key 指令，属性
   * @param _value 值
   * @param privateProps 对应组件中的属性
   */
  protected parsetPropsValue(key: string, _value: any, privateProps: string): any {
    const typeString = typeof _value;
    let value = `${privateProps}['${key}']`;
    switch (typeString) {
      case 'function':
        value = this.functionValue(key, value);
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
   * 是否显示
   * @param validateForm Form
   * @param constrol 控制器
   */
  protected isChangeShow(validateForm: FormGroup, constrol?: FormControl) {
    const isShow: any = this.isShow;
    let _isShow: boolean = isShow;
    if (typeof isShow === 'function') {
      _isShow = isShow(validateForm, constrol);
    }
    return _isShow;
  }

  /**
   * 初始化配置信息
   * @param config 配置
   * @param isFormat 是否格式化值
   */
  protected initProps(config: any): object {
    const isShow = this.isShow;
    const props = {
      ...config
    };

    if (![null, undefined].includes(isShow)) {
      props[this.getTransformProps('isShow')] = (validateForm: any, constrol: FormControl) => this.isChangeShow(validateForm, constrol);
    }
    return props;
  }

  /**
   * 转换propskey
   * @param propsKey key
   */
  protected getTransformProps(propsKey: string) {
    return this.transformProps[propsKey] || propsKey;
  }

  /**
   * 函数调用封装
   * @param key key
   * @param value value
   */
  protected functionValue(key: string, value: string) {
    let _value: string;
    if (/^\*ngIf$/.test(key)) {
      _value = `${value}(validateForm${this.controlKey ? `, ${this.controlKey}` : ''})`;
    } else if (/^\([\s\S]*\)$/.test(key)) {
      _value = `${value}($event${this.controlKey ? `, ${this.controlKey}` : ''})`;
    }
    return _value;
  }

  /**
   * 设置控制器
   * @param controlKey 控制器keyTemplate
   */
  public setFormControlKey(controlKey: string) {
    this.controlKey = controlKey;
  }

  /**
   * 获取ngIf 显示隐藏信息
   */
  public getIsShowTemplate(props: any, privateProps: string) {
    if (!props || !props['*ngIf']) {
      return ``;
    }
    return `*ngIf="${this.parsetPropsValue('*ngIf', props['*ngIf'], privateProps)}"`;
  }
}
