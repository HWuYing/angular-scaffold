import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseQuestion } from '../question';
import { GenerateProps } from '../question/generate-props';

export class DynamicFormItem extends GenerateProps {
  protected parentSerialization: any;
  public consrolParentKey: string;
  public controlKey: string;
  public question: BaseQuestion;
  public fieldDecorator: any;
  public validate: any;
  public layout: any;
  public type: string;
  public label: string | object;
  /**
   * @param config formItem配置
   * @param question 内部的form节点【input， select 等】
   */
  constructor(config: any, question: BaseQuestion, parentSerialization: any) {
    super();
    const { fieldDecorator = {}, layout, isShow } = config;
    const { label } = fieldDecorator;
    this.layout = {
      labelStyle: `width: 70px;`,
      ...layout
    };
    this.type = 'formItem';
    this.isShow = isShow;
    this.fieldDecorator = fieldDecorator;
    this.label = label ? typeof label === 'string' ? { text: label, title: label } : label : null;
    this.question = question;
    this.controlValidate = fieldDecorator.validate;
    this.validate = [];
    this.parentSerialization = parentSerialization;
    this.controlParentKey = `validateForm${this.parentSerialization.getValidateFormControlName.call(this, true)}`;
    this.controlKey = `${this.controlParentKey}?.get('${this.question.name}')`;
  }

  /**
   * 是否显示
   * @param validateForm Form
   * @param control 控制器
   */
  protected isChangeShow(validateForm: FormGroup, control?: FormControl, parentGroup?: FormGroup): boolean {
    const isShow = super.isChangeShow(validateForm, control, parentGroup);
    this.toggleControl(
      this.generateFormControlName.bind(this),
      control,
      !!(isShow && parentGroup),
      parentGroup
    );
    return isShow;
  }

  /**
   * 验证错误信息显示的template
   */
  public validateTemplate(): any {
    const controlKey = this.controlKey;
    const validate = (this.question as any).controlValidate;
    const validateTemplate: string[] = [];
    const childrenTemplate: string[] = [];
    let ifTemplate: any = ``;
    if (validate && !!validate.length) {
      this.validate = [];
      ifTemplate = {};
      validate.forEach((vali: any) => {
        const underControlKey = vali.controlKey || controlKey;
        if (vali.patter) {
          this.validate.push(vali.patter);
        }
        if (!ifTemplate[underControlKey]) {
          ifTemplate[underControlKey] = `${underControlKey}?.dirty && ${underControlKey}?.errors`;
        }
        childrenTemplate.push(`<ng-container *ngIf="${underControlKey}?.hasError('${vali.isError}')">{{ '${vali.message}'}}</ng-container>`);
      });
      ifTemplate = Object.keys(ifTemplate).map((key: string) => `(${ifTemplate[key]})`).join(' || ');
      validateTemplate.push(childrenTemplate.join(`&nbsp;&nbsp;`));
    }
    return {
      validateTemplate: validateTemplate.join(``),
      validateStatusTemplate: ifTemplate
    };
  }

  /**
   * 获取formItem的template
   */
  public getTemplate() {
    const { labelStyle, nzLayout } = this.layout;
    const question = this.question;
    const label: any = this.label;
    const { validateTemplate, validateStatusTemplate } = this.validateTemplate();
    const isRequire = this.validate.includes(Validators.required);
    const propsKey = this.question.propsKey;
    const hasLabel = !!label;
    const isSelfNzLayout = this.parentSerialization.layout.nzLayout !== nzLayout && nzLayout;
    return `<nz-form-item ${isSelfNzLayout ? `class="ant-form-${nzLayout}"` : ``} [nzFlex]="${nzLayout !== 'vertical'}">
              ${
                hasLabel
                  ? `<nz-form-label style="${labelStyle}" ${isRequire ? 'nzRequired' : ''} nzFor="${this.name}" title="${label.title}">
                      ${label.text}
                    </nz-form-label>`
                  : ''
              }
              ${validateStatusTemplate ? `<ng-template #error_tip_${propsKey}>${validateTemplate}</ng-template>` : ``}
              <nz-form-control style="flex: 1;"
                ${validateStatusTemplate ? `[nzErrorTip]="error_tip_${propsKey}" [nzValidateStatus]="${validateStatusTemplate} ? 'error' : 'success'"` : ``}
              >
                ${question.getTemplate()}
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
    const ngIf = 'isShow';
    this.question.props[ngIf] = props[ngIf];
    return super.getIsShowTemplate(props, this.question.privateProps);
  }

  /**
   * 生成表单值 【value， validate】
   * @param field 表单节点值
   */
  public generateFormControlName(field: any, fb?: FormBuilder): object {
    this.fb = fb || this.fb;
    return this.question.generateFormControlInfo(field, fb);
  }

  public setQuestionName(name: string) {
    this.name = name;
  }

  get initialValue() {
    return (this.question as any).initialValue || this.fieldDecorator.initialValue;
  }

  get spanCol() {
    const { spanCol } = this.layout;
    return spanCol;
  }
}
