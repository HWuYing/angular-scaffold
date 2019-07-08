import { FormControl, FormGroup } from "@angular/forms";

interface QuestionGenerateType {

}

interface QuestionNotControls extends QuestionGenerateType {
  style?: object;
  class?: string;
  name?: string;
  click?: {
    (event?: MouseEvent, constrol?: FormControl, validateForm?: FormGroup): void;
  }
}

export interface QuestionBaseType extends QuestionNotControls {
  ngModelChange?: {
    (val: any): void;
  };
  format?: {
    (val?: any): any;
  }
  name?: string;
  placeholder?: string;
  nzPlaceHolder?: string;
}

export interface QuestionTextType extends QuestionNotControls {
  target?: string;
  text?: string;
}

export interface QuestionIconType extends QuestionNotControls {
  type: string;
  title?: string;
  target?: string;
}

export interface QuestionButtonType extends QuestionNotControls {
  type?: string;
  text?: string;
}

export interface QuestionSelectType extends QuestionBaseType {
  nzAllowClear?: boolean;
  children?: { label: any, value: any}[];
}

export interface QuestionRadioType extends QuestionBaseType {
  title?: string;
  text?: string;
}

export interface QuestionGroupType extends QuestionGenerateType {
  children?: any;
}
