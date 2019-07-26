import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/container/dynamic-form.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Input() config: any; // 表单配置
  @Input() fieldStore: any; // 表单默认值
  @Input() layout: any; // 表单布局
  @Input() title: string = 'Search';
  @Output() readonly searchSubmit: EventEmitter<any> = new EventEmitter();
  @Output() readonly valueChanges: EventEmitter<any> = new EventEmitter();
  @ViewChild('dynamicForm', { static: true }) dynamicForm: DynamicFormComponent;
  constructor() {}

  ngOnInit() {}

  /**
   * 重置表单单值
   */
  reset() {
    this.dynamicForm.reset();
  }

  get value() {
    return this.dynamicForm.value;
  }
}
