import { FormControl, FormGroup } from "@angular/forms";

export interface Options {
  control?: FormControl,
  form?: FormGroup,
  parentForm?: FormGroup,
  data?: any,
  ngForKey?: string
}
interface QuestionGenerateType {
  style?: object;
  class?: string;
  name?: string;
  [propsKey: string]: any;
}

interface QuestionNotControls extends QuestionGenerateType {
  click?: {
    (event?: MouseEvent, options?: Options): void;
  }
}

export interface QuestionBaseType extends QuestionGenerateType {
  ngModelChange?: {
    (value: any, options?: Options): void;
  };
  disabled?: boolean | {
    (options?: Options) : boolean;
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
  nzShowSearch?: boolean;
  children?: { label: any, value: any }[];
}

export interface QuestionRadioType extends QuestionBaseType {
  title?: string;
  text?: string;
}

export interface QuestionGroupType extends QuestionGenerateType {
  children?: any;
}

export interface ContainerType extends QuestionGenerateType {
  template: string;
}

export interface UploadType extends QuestionBaseType {
  action?: string;
  isFlex?: boolean;
  [propKey: string]: any;
}
