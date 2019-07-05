import { BaseQuestion } from './base-question';

export class DatePickerQuestion extends BaseQuestion {
  static defaultProps: object = {
    nzStyle: { width: '100%' }
  };

  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, {
      ...DatePickerQuestion.defaultProps,
      ...props
    });
    this.transformProps = {
      ...this.transformProps,
      placeholder: 'nzPlaceholder'
    };
  }

  public getTemplate(): string {
    return `<nz-date-picker ${this.serializationProps()} style="width: 100%;"></nz-date-picker>`;
  }
}
