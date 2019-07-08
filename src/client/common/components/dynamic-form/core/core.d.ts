import { FormBuilder, FormGroup } from '@angular/forms';
import {
  QuestionBaseType,
  QuestionTextType,
  QuestionSelectType,
  QuestionRadioType,
  QuestionGroupType,
  QuestionIconType,
  QuestionButtonType
} from '../question/question';

type keyType = | 'textarea' | 'input' |  'monthPicker' | 'datePicker' | 'checkboxGroup' | 'rangePicker';

type QuestionType = QuestionBaseType | QuestionSelectType | QuestionTextType;

interface QuestionGroupTypeExp extends QuestionGroupType {
  children: FormItemType[];
}

interface FieldDecoratorBaseType {
  label?: string;
}

interface FieldDecoratorType extends FieldDecoratorBaseType {
  initialValue?: any;
  validate?: any[];
}

interface DynamicFormAnyType {
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

export interface DyanmicLayoutType {
  col?: number;
  spanCol?: number;
  decorator?: DynamicConfigType[];
}

export type FormItemType = FormItemOrdinaryType | FormItemSelectType | FormItemTextType |
  FormItemRadioType | FormItemInputGroupType | FormItemIconType | FormItemButtonType | 
  DyanmicFormArrayType | DyanmicFormGroupType | DyanmicFormTableType;

export type DynamicConfigType = DyanmicLayoutType | FormItemType;