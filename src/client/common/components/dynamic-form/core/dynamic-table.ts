import { DyanmicFormArray } from './dynamic-form-array';
import { SerializationBase } from './serialization-base';

const parsingColumns = (propsKey: string, columns: any[]) => {
  const decorator: any[] = [];
  let cursor = 0;
  columns.forEach((column: any, index: number) => {
    if (column.entry) {
      if (!column.entry.props) {
        column.entry.props = {};
      }
      column.entry.props.name = column.key;
      decorator.push(column.entry);
      column.template = `${propsKey}_${cursor}_td_template`;
      cursor += 1;
    }
  });
  return [columns, decorator];
};

export class DyanmicTable extends DyanmicFormArray {
  private templateName: string;
  constructor(layout: any, propsKey: string, config: any, parentSerialization: SerializationBase) {
    const { template, columns: defaultColumns } = config;
    const [columns, decorator] = parsingColumns(propsKey, defaultColumns);
    super(layout, propsKey, {
      decorator,
      ...config,
      columns
    }, parentSerialization);
    this.templateName = template;
  }

  /**
   * 序列化配置
   */
  protected serialization(config?: any): any[] {
    const { props, columns } = config;
    const name = this.name;
    const decorator = this.decorator;
    const parentSerialization = this.parentSerialization;
    this.types = [];
    const children = this.privateSerialization(decorator, this.propsKey);
    parentSerialization.serializationProps = {
      ...parentSerialization.serializationProps,
      ...this.serializationProps
    };
    this.rootParent.serializationProps[this.propsKey] = {
      ...props,
      columns,
      dataSource: this.initialValues
    };
    (parentSerialization as this).serializationFormItem.push(this);
    parentSerialization.privateInitialValue[name] = this.initialValues;
    return children;
  }

  getTdTemplate(): any[] {
    let template = ``;
    const tdTemplateMap: any[] = [];
    const propsKey = this.propsKey;
    const ngForKey = this.ngForKey;
    template += this.children.reduce((underTemplate: string, child: any, index: number) => {
      const tdTemplateKey = `${propsKey}_${index}_td_template`;
      let isShowProps = ``;
      let childTemplate = `<ng-template #${tdTemplateKey} let-${ngForKey}="index" let-data>`;
      if (child.getIsShowTemplate) {
        isShowProps = child.getIsShowTemplate();
      }
      childTemplate += `<ng-container ${isShowProps} [formGroupName]="${ngForKey}">`;
      childTemplate += child.getTemplate();
      childTemplate += '</ng-container>';
      childTemplate += `</ng-template>`;
      tdTemplateMap.push(`${tdTemplateKey}: ${tdTemplateKey}`);
      return underTemplate + childTemplate;
    }, ``);
    return [ template, tdTemplateMap ];
  }

  getTemplate() {
    const name = this.name;
    const propsKey = this.propsKey;
    const templateName = this.templateName;
    const serializationProps = `serialization.serializationProps.${propsKey}`;
    const [ tdTemplate, tdTemplateMap ] = this.getTdTemplate();
    let template = `<ng-container formArrayName="${name}">`;
    template += tdTemplate;
    template += `<ng-container
      *ngTemplateOutlet="templateMap.${templateName};
        context: {
          $implicit: validateForm,
          columns: ${serializationProps}.columns,
          tdTemplateMap: {${tdTemplateMap.join(',')}}
        }"
    >
    </ng-container>`;
    template += `</ng-container>`;
    return template;
  }
}
