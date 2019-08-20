import { BaseQuestion } from './base-question';

export class RangePickerQuestion extends BaseQuestion {
  static defaultProps: object = {
    nzStyle: { width: '100%' }
  };

  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, {
      ...RangePickerQuestion.defaultProps,
      ...props
    });
    this.mergeTransformProps({ placeholder: 'nzPlaceholder' });
  }

  public getTemplate(): string {
    return `<nz-range-picker ${this.serializationProps()} style="width: 100%;"></nz-range-picker>`;
  }
}
