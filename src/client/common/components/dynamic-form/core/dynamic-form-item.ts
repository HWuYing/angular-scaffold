import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseQuestion } from '../question';
import { GenerateProps } from '../question/generate-props';

export class DynamicFormItem extends GenerateProps {
  protected parentSerialization: any;
  private constrolParentKey: string;
  private fb: FormBuilder;
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
    super();
    const { fieldDecorator, layout, isShow } = config;
    this.layout = {
      labelStyle: `width: 70px;`,
      ...layout
    };
    this.type = 'formItem';
    this.isShow = isShow;
    this.fieldDecorator = fieldDecorator || {};
    this.question = question;
    this.validate = [];
    this.parentSerialization = parentSerialization;
    this.constrolParentKey = `validateForm${this.getValidateFormControlName()}`;
    this.controlKey = `${this.constrolParentKey}?.get('${this.name}')`;
  }

  /**
   * 是否显示
   * @param validateForm Form
   * @param constrol 控制器
   */
  protected isChangeShow(validateForm: FormGroup, constrol?: FormControl) {
    const _isShow = super.isChangeShow(validateForm, constrol);
    if (_isShow) {
      if (constrol.value === null) {
        constrol.setValue(this.initialValue);
      }
    } else {
      constrol.setValue(null);
    }
    return _isShow;
  }

  /**
   * 获取存储结构
   */
  private getValidateFormControlName() {
    let parentSerialization = this.parentSerialization;
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
    const fieldDecorator = this.fieldDecorator;
    const name = this.name;
    const controlKey = this.controlKey;
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
    const { labelStyle } = this.layout;
    const fieldDecorator = this.fieldDecorator;
    const question = this.question;
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
   * 获取ngIf
   */
  public getIsShowTemplate() {
    if ([null, undefined].includes(this.isShow)) {
      return ``;
    }
    const props = this.initProps({});
    const ngIf = this.getTransformProps('isShow');
    this.question.props[ngIf] = props[ngIf];
    return super.getIsShowTemplate(props, this.question.privateProps);
  }

  /**
   * 生成表单值 【value， validate】
   * @param field 表单节点值
   */
  public generateFormControlName(field: any, fb?: FormBuilder): object {
    const name = this.question.name;
    this.fb = fb;
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
