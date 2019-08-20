import { BaseQuestion } from './base-question';

export class CheckboxGroupQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    super(key, propsKey, props);
    this.mergePropsExtends(this.transformProps.size);
  }

  public getTemplate(): string {
    return `<nz-checkbox-group ${this.serializationProps()}></nz-checkbox-group>`;
  }
}
