import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/enquire/dynamic-form.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Input() config: any; // 表单配置
  @Input() fieldStore: any; // 表单默认值
  @Input() layout: any; // 表单布局
  @Input() nzLayout: string = 'inline';
  @Input() title: string = 'Search';
  @Input() isSubmit: boolean = false;
  @Input() width: string;
  @Input() templateMap: { [key: string]: TemplateRef<void> };
  @Output() readonly searchSubmit: EventEmitter<any> = new EventEmitter();
  @Output() readonly valueChanges: EventEmitter<any> = new EventEmitter();
  @ViewChild('dynamicForm', { static: false }) dynamicForm: DynamicFormComponent;
  constructor() {}

  ngOnInit() {}

  /**
   * 重置表单单值
   */
  reset() {
    this.dynamicForm.reset();
  }

  /**
   * 程序调用表单提交
   */
  submit() {
    this.dynamicForm.submit();
  }

  /**
   * 合并设置表单值
   */
  patchValue(value: { [key: string]: any; }, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    this.dynamicForm.patchValue(value, options);
  }

  get value() {
    return this.dynamicForm.value;
  }

  get allValue() {
    return this.dynamicForm.allValue;
  }
}
