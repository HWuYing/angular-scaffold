import { BaseQuestion } from './base-question';

export class MonthPickerQuestion extends BaseQuestion {
  static defaultProps: object = {
    nzStyle: { width: '100%' }
  };

  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, {
      ...MonthPickerQuestion.defaultProps,
      ...props
    });
    this.transformProps = {
      ...this.transformProps,
      placeholder: 'nzPlaceholder'
    };
  }

  public getTemplate(): string {
    return `<nz-month-picker ${this.serializationProps()} style="width: 100%;"></nz-month-picker>`;
  }
}
