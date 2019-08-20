import { BaseQuestion } from './base-question';

export class DatePickerQuestion extends BaseQuestion {

  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, {
      ...props,
      nzStyle: { width: '100%'}
    });
    this.mergeTransformProps({ disabledDate: '[nzDisabledDate]', placeholder: 'nzPlaceholder' });
  }

  public getTemplate(): string {
    return `<nz-date-picker style="width: 100%;" ${this.serializationProps()}></nz-date-picker>`;
  }
}
