import { BaseQuestion } from './base-question';

export class SelectQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, props);
    this.propsExclude = [ ...this.propsExclude, 'children' ];
    this.transformProps = {
      ...this.transformProps,
      placeholder: 'nzPlaceHolder'
    };
  }

  public getTemplate(): string {
    let template = `<nz-select ${this.serializationProps()}>`;
    template += `<nz-option *ngFor="let c of ${this.privateProps}.children;"
      nzLabel="{{c.label}}" [nzValue]="c.value"></nz-option>`;
    template += `</nz-select>`;
    return template;
  }
}
