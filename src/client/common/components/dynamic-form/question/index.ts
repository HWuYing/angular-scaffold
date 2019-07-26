import { BaseQuestion } from './base-question';
import { ButtonQuestion } from './button-question';
import { CheckboxGroupQuestion } from './checkbox-group-question';
import { CheckBoxQuestion } from './checkbox-question';
import { ContainerQuestion } from './container-question';
import { DatePickerQuestion } from './date-picker-question';
import { IconQuestion } from './icon-question';
import { InputGroupQuestion } from './input-group-question';
import { InputNumberQuestion } from './input-number-question';
import { InputQuestion } from './input-question';
import { MonthPickerQuestion } from './month-picker-question';
import { QuestionGroupQuestion } from './question-group-question';
import { RadioGroupQuestion } from './radio-group-question';
import { RadioQuestion } from './radio-question';
import { RangePickerQuestion } from './range-picker-question';
import { SelectQuestion } from './select-question';
import { TextQuestion } from './text-question';
import { TextareaQuestion } from './textarea-question';
import { TimePickerQuestion } from './time-picker-question';
import { UploadQuestion } from './upload-question';

const hasOwnProperty = (o: any, name: string) => Object.prototype.hasOwnProperty.call(o, name);

const questionMap = {
  text: TextQuestion,
  textarea: TextareaQuestion,
  input: InputQuestion,
  icon: IconQuestion,
  select: SelectQuestion,
  monthPicker: MonthPickerQuestion,
  datePicker: DatePickerQuestion,
  timePicker: TimePickerQuestion,
  inputGroup: InputGroupQuestion,
  questionGroup: QuestionGroupQuestion,
  button: ButtonQuestion,
  checkbox: CheckBoxQuestion,
  checkboxGroup: CheckboxGroupQuestion,
  radio: RadioQuestion,
  radioGroup: RadioGroupQuestion,
  rangePicker: RangePickerQuestion,
  upload: UploadQuestion,
  inputNumber: InputNumberQuestion,
  container: ContainerQuestion
};

export { BaseQuestion };

export const getQuestion = (propsKey: string, config: any) => {
  const { key, props, isShow } = config;
  if (hasOwnProperty(questionMap, key)) {
    return new questionMap[key](key, propsKey, { ...props, isShow }, getQuestion);
  } else {
    return new Error(`questionMap not find ${key}`);
  }
};
