import { BaseQuestion } from './base-question';

export class UploadQuestion extends BaseQuestion {
  constructor(key: string, propsKey: string, props: any) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.mergeTransformProps({
      action: 'nzAction',
      data: 'nzData',
      success: '(nzSuccess)',
      error: '(nzError)',
      nzBeforeUpload: '[nzBeforeUpload]'
    });
  }
  public getTemplate(): string {
    return `<app-upload ${this.serializationProps()}></app-upload>`;
  }
}
