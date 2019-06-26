import { EventEmitter } from '@angular/core';
import { BaseQuestion } from './base-question';

export class TextQuestion extends BaseQuestion {
  private target: string;
  constructor(key: string, propsKey: string, props: any) {
    const { target, ...other } = props;
    super(key, propsKey, other);
    this.propsExclude = ['text'];
    this.target = target || 'span';
    this.isAddFormConstrolName = false;
  }

  public getTemplate(): string {
    const text = this.constrolKey && this.name ? this.constrolKey + '.value' : `${this.privateProps}.text`;
    return `<${this.target} ${this.serializationProps()}>{{ ${text} }}</${this.target}>`;
  }
}
