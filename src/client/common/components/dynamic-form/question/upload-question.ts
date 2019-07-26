import { BaseQuestion } from './base-question';

export class UploadQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.transformProps = {
      ...this.transformProps,
      action: 'nzAction',
      data: 'nzData',
      success: '(nzSuccess)',
      error: '(nzError)'
    };
  }
  public getTemplate(): string {
    return `<app-upload ${this.serializationProps()}></app-upload>`;
  }
}
