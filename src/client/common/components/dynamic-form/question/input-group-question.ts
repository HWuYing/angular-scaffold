import { BaseQuestion } from './base-question';
import { QuestionGroupQuestion } from './question-group-question';

export class InputGroupQuestion extends QuestionGroupQuestion {
  getTemplate() {
    let template = `<nz-input-group nzCompact>`;
    template += this.children.reduce((underTemplate: string, child: BaseQuestion) =>  underTemplate + child.getTemplate(), ``);
    template += `</nz-input-group>`;
    return template;
  }
}
