import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export class GenerateProps {
  protected isShow: boolean;
  protected propsExclude: string[] = ['*ngIf'];
  protected transformProps: any = {
    ngModelChange: '(ngModelChange)',
    style: '[ngStyle]',
    class: '[ngClass]',
    isShow: '*ngIf',
    click: '(click)',
    disabled: 'attr.disabled'
  };
  protected controlValidate: any[] = [];
  protected initialValue: any;
  protected controlKey: string;
  protected controlParentKey: string;
  protected fb: FormBuilder;
  constructor(defaultProps?: any) {
    const underDefaultProps = defaultProps || {};
    this.isShow = underDefaultProps.isShow;
  }

  /**
   * 解析生成props value
   * @param key 指令，属性
   * @param underValue 值
   * @param privateProps 对应组件中的属性
   */
  protected parsetPropsValue(key: string, underValue: any, privateProps: string): any {
    const typeString = typeof underValue;
    const transformKey = this.getTransformProps(key);
    let value = `${privateProps}['${key}']`;
    switch (typeString) {
      case 'function':
        value = this.functionValue(transformKey, value);
        break;
      case 'number':
      case 'boolean':
        value = underValue;
        break;
      case 'string':
        value = `'${underValue}'`;
        break;
    }
    return value;
  }

  /**
   * 是否显示
   * @param validateForm Form
   * @param control 控制器
   */
  protected isChangeShow(validateForm: FormGroup, control?: FormControl, parentGroup?: FormGroup) {
    const isShow: any = this.isShow;
    let privateIsShow: boolean = isShow;
    if (typeof isShow === 'function') {
      privateIsShow = isShow(validateForm, control, parentGroup);
    }
    return privateIsShow;
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
      props[this.getTransformProps('isShow')] = (validateForm: any, control: FormControl, propsGroup?: FormGroup) => this.isChangeShow(validateForm, control, propsGroup);
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
    let underValue: string;
    if (/^\*ngIf$/.test(key)) {
      underValue = this.getNgIfProps(value);
    } if(/\(ngModelChange\)/.test(key)) {
      underValue = `${value}($event, ${this.controlKey ? `${this.controlKey}` : 'null'}, validateForm, ${this.controlParentKey})`;
    } else if (/^\([\s\S]*\)$/.test(key)) {
      underValue = this.getNgIfProps(value);
    }
    return underValue;
  }

  /**
   * 获取*ngif的拼接
   * @param propsKey props对应值
   */
  protected getNgIfProps(propsKey: string) {
    return `${propsKey}(validateForm${this.controlKey ? `, ${this.controlKey}, ${this.controlParentKey}` : ''})`;
  }

  /**
   * 是否排除对key进行序列化
   * @param key string
   */
  protected isExcludeKey(key: string, value: any): boolean {
    let status = this.propsExclude.includes(key);
    if (!status) {
      switch (key) {
        case 'disabled': value === true ? status = false : status = true; break;
      }
    }
    return status;
  }

  /**
   * 添加、删除当前control
   * @param controlOption controlOption
   * @param addStatus isadd
   * @param parentGroup FormGroup
   */
  protected toggerControl(controlOption: any, addStatus: boolean, parentGroup: FormGroup) {
    Object.keys(controlOption).forEach((name: string) => {
      if (addStatus) {
        if (!parentGroup.get(name)) {
          const option = controlOption[name];
          parentGroup.addControl(name, this.fb.control(option[0], option[1]));
        }
      } else if (parentGroup.get(name)) {
        parentGroup.removeControl(name);
      }
    });
  }

  /**
   * 设置控制器
   * @param controlKey 控制器keyTemplate
   */
  public setFormControlKey(controlKey: string, controlParentKey: string) {
    this.controlKey = controlKey;
    this.controlParentKey = controlParentKey;
  }

  /**
   * 设置控件验证规则
   * @param validate 验证规则
   */
  public setFormControlValidate(validate: any[]) {
    if (!Array.isArray(validate) && !!validate) {
      this.setFormControlValidate([validate]);
    } else {
      this.controlValidate = [...(validate || [])];
    }
  }

  /**
   * 设置初始值
   * @param initialValue 初始值
   */
  public setControlInitialValue(initialValue: any) {
    this.initialValue = initialValue;
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
