import { BaseQuestion } from './base-question';
import { InputQuestion } from './input-question';
import { SelectQuestion } from './select-question';
import { MonthPickerQuestion } from './month-picker-question';
import { TextQuestion } from './text-question';

const hasOwnProperty = (o: any, name: string) => Object.prototype.hasOwnProperty.call(o, name);

const questionMap = {
  text: TextQuestion,
  input: InputQuestion,
  select: SelectQuestion,
  monthPicker: MonthPickerQuestion,
};

export { BaseQuestion };

export const getQuestion = (propsKey: string, config: any) => {
  const { key, props } = config;
  if (hasOwnProperty(questionMap, key)) {
    return new questionMap[key](key, propsKey, props);
  } else {
    return new Error(`questionMap not find ${key}`);
  }
};
