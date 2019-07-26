import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DynamicConfigType } from '../dynamic-form/dynamic-form';
import { DynamicFormComponent } from '../dynamic-form/container/dynamic-form.component';
import { Options } from '../dynamic-form/question/question';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.less'],
  host: {
    'class': `edit-table`,
    '[class.remove-td-hover]': `removeHover`
  }
})
export class EditTableComponent implements OnInit {
  public _dataSource: any = [];
  @Input() set columns(value: any) {
    this.factoryEntryConfig = EditTableComponent.getInitEntryConfig('editTable', 'editTable', this.factoryColumnChange(value));
    this.initEntryConfig();
  }
  @Input() set dataSource(value: any[]) {
    this._dataSource = value;
    this.fieldStore = { editTable: this._dataSource };
  }
  @Input() height: string;
  @Input() isHeadFixed: boolean; // 表头固定
  @Input() title: TemplateRef<void> | string;
  @Input() footer: string | TemplateRef<void>; // 表格尾
  @Input() theadColumns: any[];
  @Input() removeHover: boolean = true;
  @Input() templateMap: object = {};
  @Input() tdTemplateRef: TemplateRef<any>;
  @Input() showCheckbox: boolean;
  @Input() isSerial: boolean;
  @ViewChild('dynamicForm', { static: false }) dynamicForm: DynamicFormComponent;
  @ViewChild('dynamicTable', { static: false }) dynamicTable: DynamicTableComponent;
  @Output() readonly paginationChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly currentPageDataChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly checkChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly sourceChange: EventEmitter<any> = new EventEmitter();
  public fieldStore: object;
  public entryConfig: any[];
  private factoryEntryConfig: (name: string) => any[];
  constructor() { }

  ngOnInit() {
    this.entryConfig = this.initEntryConfig();
  }

  private initEntryConfig(): any[] {
    this.entryConfig = this.factoryEntryConfig(this._dataSource);
    return this.entryConfig;
  }

  /**
   * 选中数据
   * @param checkList 选中key列表
   */
  checkRows(checkList: any, isNotMerge?: boolean) {
    this.dynamicTable.checkRows(checkList, isNotMerge);
  }

  /**
   * 清除数据
   * @param clearList 清除列表
   */
  clearCheckRows(clearList: any) {
    this.dynamicTable.clearCheckRows(clearList);
  }

  /**
   * 选中所有选项
   */
  checkAll() {
    this.dynamicTable.checkAll();
  }

  /**
   * 清除所有选择项目
   */
  clearSelectRowKeys() {
    this.dynamicTable.clearSelectRowKeys();
  }

  /**
   * 合并templateMap
   * @param tdTemplateMap tdTemplate
   */
  mergeTemplateMap(tdTemplateMap: object) {
    return {
      ...tdTemplateMap,
      ...this.templateMap
    };
  }

  /**
   * 移除可编辑属性
   * @param column any
   */
  removeEdit(column: any, data: any) {
    if (typeof column.isEditor === 'function' && column.isEditor(data)) {
      return Object.keys(column).filter((key: string) => key !== 'template').reduce((o: object, key: string) => ({
        ...o,
        [key]: column[key]
      }), {});
    }
    return column;
  }

  /**
   * 数据改变时回掉
   * @param column any
   * @param data any
   * @param value any
   * @param index string
   */
  onSourceChange(column: any, value: any, index: string) {
    const { key } = column;
    const oldData = this._dataSource[index];
    const newData = { ...oldData, [key]: value };
    this._dataSource[index] = newData;
    this.sourceChange.emit({ newData, oldData });
  }

  /**
   * 创建change事件
   * @param column any
   */
  factoryChange(column: any) {
    const entry = column.entry;
    const props = entry.props || {};
    const change = props.ngModelChange;
    return (value: any, options: Options) => {
      const { ngForKey } = options;
      if (change) {
        change(value, options);
      }
      this.onSourceChange(column, value, ngForKey);
    };
  }

  /**
   * 创建change事件
   * @param columns any[]
   */
  factoryColumnChange(columns: any[]) {
    return columns.map((column: any) => {
      const entry = column.entry;
      if (entry) {
        entry.props = {
          ...entry.props || {},
          ngModelChange: this.factoryChange(column)
        };
      }
      return column;
    });
  }

  get dataSource(): any[] {
    const value: any = this.dynamicForm.allValue;
    const valueDataSource = value.editTable || [];
    return this._dataSource.map((data: any, index: number) => ({
      ...data,
      ...(valueDataSource[index] || {})
    }));
  }

  /**
   * 获取验证是否成功
   */
  get valid(): boolean {
    this.dynamicForm.validationForm();
    return this.dynamicForm.valid;
  }

  get checkedOption() {
    return this.dynamicTable.checkedOption;
  }

  static getInitEntryConfig = (templateName: string, name: string, columns: any[]): any => {
    return (dataSource: any[]): DynamicConfigType[] => [{
      type: 'table',
      template: templateName,
      columns,
      fieldDecorator: {
        initialValue: dataSource
      },
      props: {
        name
      }
    }];
  }
}
