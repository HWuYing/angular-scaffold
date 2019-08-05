import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Options,
  QuestionBaseType,
  QuestionTextType,
  QuestionSelectType,
  QuestionRadioType,
  QuestionGroupType,
  QuestionIconType,
  QuestionButtonType,
  UploadType,
  ContainerType
} from '../question/question';

type keyType = | 'textarea' | 'input' | 'inputNumber' |  'monthPicker' | 'timePicker' | 'datePicker' | 'checkboxGroup' | 'rangePicker';

type QuestionType = QuestionBaseType | QuestionSelectType | QuestionTextType;

interface QuestionGroupTypeExp extends QuestionGroupType {
  children: FormItemType[];
}

interface FieldDecoratorBaseType {
  label?: string | {
    text?: string;
    title?: string;
  };
}

interface FieldDecoratorType extends FieldDecoratorBaseType {
  initialValue?: any;
  validate?: any[];
}

interface DynamicFormAnyType extends DyanmicLayoutType {
  type: string;
  props?: {
    name: string;
  };
  decorator?: DynamicConfigType[];
}

interface FormItemBaseType {
  isShow?: boolean | {
    (validateForm: FormGroup): boolean;
  };
  layout?: {
    labelStyle?: string;
    spanCol?: number;
    nzLayout?: 'horizontal' | 'vertical' | 'inline';
  },
  fieldDecorator?: FieldDecoratorType;
}

/**
 * 普通配置项
 */
export interface FormItemOrdinaryType extends FormItemBaseType {
  key: keyType;
  props?: QuestionBaseType;
}

/**
 * select配置项
 */
export interface FormItemSelectType extends FormItemBaseType {
  key: 'select' | 'monthPicker' | 'datePicker' | 'radioGroup';
  props?: QuestionSelectType;
}

/**
 * radio配置项
 */
export interface FormItemRadioType extends FormItemBaseType {
  key: 'radio' | 'checkbox';
  props?: QuestionRadioType;
}

/**
 * text配置项
 */
export interface FormItemTextType extends FormItemBaseType {
  key: 'text';
  props?: QuestionTextType;
}

/**
 * icon配置项
 */
export interface FormItemIconType extends FormItemBaseType {
  key: 'icon';
  props?: QuestionIconType;
}

/**
 * button配置项
 */
export interface FormItemButtonType extends FormItemBaseType {
  key: 'button';
  props?: QuestionButtonType;
}

/**
 * inputGroup配置项
 */
export interface FormItemInputGroupType extends FormItemBaseType {
  key: 'inputGroup' | 'questionGroup';
  props?: QuestionGroupTypeExp;
}


export interface DyanmicFormArrayType extends DynamicFormAnyType {
  type: 'formArray' | 'table';
  fieldDecorator?: {
    initialValue: any[];
  };
}

export interface DyanmicFormGroupType extends DynamicFormAnyType {
  type: 'formGroup';
  fieldDecorator?: {
    initialValue: {[key: string]: any};
  };
}

export interface DyanmicFormTableType extends DyanmicFormArrayType {
  type: 'table';
  template: string;
  columns: object[];
}

export interface DyanmicUploadType extends FormItemBaseType {
  key: 'upload';
  props: UploadType;
}

export interface DynamicContainerFormType extends FormItemBaseType {
  type: 'container';
  template: string;
}

export interface ContainerFormType extends FormItemBaseType {
  key: 'container';
  props: ContainerType;
}

export interface DyanmicLayoutType {
  col?: number;
  spanCol?: number;
  decorator?: DynamicConfigType[];
}

export type FormItemType = FormItemOrdinaryType | FormItemSelectType | FormItemTextType |
  FormItemRadioType | FormItemInputGroupType | FormItemIconType | FormItemButtonType | 
  DyanmicFormArrayType | DyanmicFormGroupType | DyanmicFormTableType | DyanmicUploadType |
  ContainerFormType | DynamicContainerFormType;

export type DynamicConfigType = DyanmicLayoutType | FormItemType;