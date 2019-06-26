import { Validators, FormBuilder } from '@angular/forms';
import { BaseQuestion } from '../question';

export class DynamicFormItem {
  protected parentSerialization: any;
  public controlKey: string;
  public question: BaseQuestion;
  public fieldDecorator: any;
  public validate: any;
  public layout: any;
  public type: string;
  /**
   * @param config formItem配置
   * @param question 内部的form节点【input， select 等】
   */
  constructor(config: any, question: BaseQuestion, parentSerialization: any) {
    const { fieldDecorator, layout } = config;
    this.layout = {
      labelStyle: `width: 70px;`,
      ...layout,
    };
    this.type = 'formItem';
    this.fieldDecorator = fieldDecorator || {};
    this.question = question;
    this.validate = [];
    this.parentSerialization = parentSerialization;
    this.controlKey = `validateForm${this.getValidateFormControlName()}?.get('${this.name}')`;
  }

  /**
   * 获取存储结构
   */
  private getValidateFormControlName() {
    let { parentSerialization } = this;
    const nameArray = [];
    let isArrayConstrol: boolean;
    while (!!parentSerialization && !!parentSerialization.name) {
      isArrayConstrol = parentSerialization.type === 'formArray';
      nameArray.unshift(`get('${parentSerialization.name}')${isArrayConstrol ? `?.get(i.toString())` : ''}`);
      parentSerialization = parentSerialization.parentSerialization;
    }
    if (nameArray.length) {
      nameArray.unshift('');
    }
    return nameArray.join('?.');
  }

  /**
   * 验证错误信息显示的template
   */
  public validateTemplate(): string {
    const { fieldDecorator, name, controlKey } = this;
    const { validate } = fieldDecorator;
    let template = ``;
    if (!validate || !name) {
      return template;
    }
    this.validate = [];
    template += `<nz-form-explain *ngIf="${controlKey}?.dirty && ${controlKey}?.errors">`;
    validate.forEach((vali: any) => {
      this.validate.push(vali.patter);
      template += `
        <ng-container *ngIf="${controlKey}?.hasError('${vali.isError}')">
          ${vali.message}
        </ng-container>`;
    });
    template += `</nz-form-explain>`;
    return template;
  }

  /**
   * 获取formItem的template
   */
  public getTemplate() {
    const {
      question,
      fieldDecorator,
      layout: { labelStyle },
    } = this;
    const { label } = fieldDecorator;
    const validateTemplate = this.validateTemplate();
    const isRequire = this.validate.includes(Validators.required);
    const hasLabel = fieldDecorator && !!label;
    return `<nz-form-item [nzFlex]="true">
              ${
                hasLabel
                  ? `<nz-form-label style="${labelStyle}" ${isRequire ? 'nzRequired' : ''} nzFor="${this.name}">${label}</nz-form-label>`
                  : ''
              }
              <nz-form-control style="flex: 1;">
                ${question.getTemplate()}
                ${validateTemplate}
              </nz-form-control>
            </nz-form-item>`;
  }

  /**
   * 生成表单值 【value， validate】
   * @param field 表单节点值
   */
  public generateFormControlName(field: any, fb?: FormBuilder): object {
    const name = this.question.name;
    return name ? { [name]: [field || field === 0 || field === '' ? field : this.initialValue, this.validate] } : {};
  }

  get initialValue() {
    return this.fieldDecorator.initialValue;
  }

  get name() {
    return this.question.name;
  }

  get spanCol() {
    const { spanCol } = this.layout;
    return spanCol;
  }
}
