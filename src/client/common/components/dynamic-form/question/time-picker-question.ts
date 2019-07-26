import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseQuestion } from './base-question';

export class TimePickerQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, props);
    this.transformProps = {
      ...this.transformProps,
      placeholder: 'nzPlaceholder'
    };
  }

  public getTemplate(): string {
    return `<nz-time-picker style="width: 100%;" ${this.serializationProps()}></nz-time-picker>`;
  }

  public generateFormControlInfo(field: any, fb?: FormBuilder) {
    let defField = field;
    if (typeof defField === 'string') {
      defField = new Date(defField);
    }
    return super.generateFormControlInfo(defField, fb);
  }
}
