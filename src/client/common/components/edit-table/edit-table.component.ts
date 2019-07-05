import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/enquire/dynamic-form.component';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.less']
})
export class EditTableComponent implements OnInit {
  private _dataSource: any = [];
  @Input() set columns(value: any) {
    this.factoryEntryConfig = EditTableComponent.getInitEntryConfig('editTable', 'editTable', value);
    this.initEntryConfig();
  }
  @Input() set dataSource(value: any[]) {
    this._dataSource = value;
    this.fieldStore = { editTable: this._dataSource };
    this.initEntryConfig();
  }
  @Input() templateMap: object;
  @Input() tdTemplateRef: TemplateRef<any>;
  @Input() showCheckbox: boolean;
  @Input() isSerial: boolean;
  @ViewChild('dynamicForm', { static: true }) dynamicForm: DynamicFormComponent;
  @ViewChild('dynamicTable', { static: true }) dynamicTable: DynamicTableComponent;
  @Output() readonly paginationChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly currentPageDataChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly checkChange: EventEmitter<any> = new EventEmitter();
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

  get dataSource(): any[] {
    const _value: any = this.dynamicForm.value;
    const _valueDataSource = _value.editTable || [];
    return this._dataSource.map((data: any, index: number) => ({
      ...data,
      ...(_valueDataSource[index] || {})
    }));
  }

  /**
   * 获取验证是否成功
   */
  get valid(): boolean {
    this.dynamicForm.validationForm();
    return this.dynamicForm.valid;
  }

  static getInitEntryConfig = (templateName: string, name: string, columns: any[]): any => {
    return (dataSource: any[]) => [{
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
