import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseQuestion } from './base-question';

export class QuestionGroupQuestion extends BaseQuestion {
  protected getQuestion: (propsKey: string, config: any) => BaseQuestion;
  protected childrenConfig: any[];
  protected children: any[];
  constructor(key: string, propsKey: string, props: any, getQuestion: (propsKey: string, config: any) => BaseQuestion) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.getQuestion = getQuestion;
    this.childrenConfig = children;
    this.children = this.getChildren(children);
  }

  getChildren(children: any[]): any[] {
    const selfProps = this.props as any;
    return children.map((child: any, index: number) => {
      const { fieldDecorator, props, ...other } = child;
      const question = this.getQuestion(`${this.propsKey}.children${index}`, {
        ...other,
        props: {
          ...props,
          ...selfProps.size ? { size: selfProps.size } : {}
        }
      });
      (question as this).propsExclude = (question as this).propsExclude.filter((underKey: string) => underKey !== this.transformProps.isShow);
      if (fieldDecorator) {
        question.setControlInitialValue(fieldDecorator.initialValue);
        question.setFormControlValidate(fieldDecorator.validate);
      }
      this.props[`children${index}`] = question.props;
      return question;
    });
  }

  getTemplate() {
    let template = `<span>`;
    template += this.children.reduce((underTemplate: string, child: BaseQuestion) =>  underTemplate + child.getTemplate(), ``);
    template += `</span>`;
    return template;
  }

  generateFormControlInfo(field: any, fb?: FormBuilder) {
    const underUnderField = field || {};
    return this.children.reduce((o: object, child: BaseQuestion) => {
      const underField = underUnderField[child.name];
      return {
        ...o,
        ...child.generateFormControlInfo(underField, fb)
      };
    }, {});
  }

   /**
   * 设置控制器
   * @param controlKey 控制器keyTemplate
   */
  public setFormControlKey(controlKey: string, controlParentKey: string) {
    super.setFormControlKey(controlKey, controlParentKey);
    const name = this.name || 'undefined';
    this.controlValidate = [];
    this.children.forEach((child: BaseQuestion) => {
      const underControlKey = this.controlKey.replace(name, child.name);
      child.setFormControlKey(underControlKey, this.controlParentKey);
      (child as any).controlValidate.forEach((validate: any) => {
        this.controlValidate.push({
          controlKey: underControlKey,
          ...validate
        });
      });
    });
  }

  /**
   * 是否是formArray下的控件
   * @param isArrayChildren boolean
   */
  public setIsArrayChildren(isArrayChildren: boolean, ngForKey: string) {
    this.isArrayChildren = isArrayChildren;
    this.ngForKey = ngForKey;
    this.children.forEach((child: BaseQuestion) => {
      child.setIsArrayChildren(isArrayChildren, ngForKey);
    });
  }

  /**
   * 设置初始值
   * @param initialValue 初始值
   */
  public setControlInitialValue(initialValue: any) {
    const underInitialValue = initialValue || {};
    this.initialValue = {};
    this.initialValue = this.children.reduce((o: object, child: BaseQuestion) => {
      if (child.name) {
        o[child.name] = (child as any).initialValue || underInitialValue[child.name];
      }
      return o;
    }, {});
  }
}
