import { BaseQuestion } from './base-question';

export class RadioGroupQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, props);
    this.propsExclude = [...this.propsExclude, 'children'];
  }

  public getTemplate(): string {
    let template = `<nz-radio-group ${this.serializationProps()}>`;
    template += `<label nz-radio *ngFor="let child of ${this.privateProps}.children;"
      [nzValue]="child.value">{{ child.label }}</label>`;
    template += `</nz-radio-group>`;
    return template;
  }
}
