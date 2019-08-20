import { BaseQuestion } from './base-question';

export class RadioGroupQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, props);
    this.mergePropsExtends(['children', 'style']);
  }

  public getTemplate(): string {
    const template: string[] = [];
    template.push(`<nz-radio-group ${this.serializationProps()}>`);
    template.push(`<label nz-radio *ngFor="let c of ${this.privateProps}.children;" [nzValue]="c.value">{{ c.label }}</label>`);
    template.push(`</nz-radio-group>`);
    if (this.props.hasOwnProperty('style')) {
      template.unshift(`<div [ngStyle]="${this.privateProps}.style">`);
      template.push(`</div>`);
    }
    return template.join('');
  }
}
