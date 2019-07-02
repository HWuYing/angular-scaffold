import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Injector,
  NgModuleRef,
  Input,
  Output,
  EventEmitter,
  ComponentRef,
  ViewContainerRef,
} from '@angular/core';
import { DynamicFormService } from '../providers/dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [DynamicFormService],
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @ViewChild('tplRef', { read: ViewContainerRef, static: true }) tplRef: ViewContainerRef;
  @Input() set nzLayout(value: string) {
    this.dynamicFormService.nzLayout = value;
  }
  @Input() set layout(value: any) {
    this.dynamicFormService.layout = value;
  }
  @Input() set config(value: any) {
    this.setConfig(value);
  }
  @Input() set fieldStore(value: any) {
    this.resetFormFieldStore(value);
  }
  @Output() dynamicSubmit: EventEmitter<any> = new EventEmitter();
  @Output() valueChanges: EventEmitter<any> = new EventEmitter();
  private cmpRef: ComponentRef<any>;
  constructor(
    private dynamicFormService: DynamicFormService,
    private _injector: Injector,
    private _m: NgModuleRef<any>,
  ) { 
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyCmpRef();
  }

  /**
   * 设置config值
   * @param value any
   */
  private setConfig(value: any) {
    if (!this.dynamicFormService.config && (!value || (Array.isArray(value) && !value.length))) {
      return;
    }
    this.dynamicFormService.config = value;
    this.loadDynamicForm();
  }

  /**
   * 获取合并以前的value
   */
  private mergeInstance(): object {
    if (!this.cmpRef) {
      return {};
    }
    return {
      fieldStore: this.value,
    };
  }

  /**
   * 设置form的值
   * @param fieldStore form表单值
   */
  resetFormFieldStore(fieldStore: any) {
    if (!this.cmpRef) {
      return;
    }
    const dynamicForm = this.cmpRef['_component'];
    dynamicForm.resetValidateForm(fieldStore);
  }

  /**
   * 程序调用表单提交
   */
  submit() {
    const dynamicForm = this.cmpRef['_component'];
    (dynamicForm as any).onSubmit();
  }

  /**
   * 重置表单数据
   */
  reset() {
    const dynamicForm = this.cmpRef['_component'];
    (dynamicForm as any).resetForm();
  }

  /**
   * 注销动态组件
   */
  destroyCmpRef() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }

  /**
   * 加载动态组件
   */
  loadDynamicForm() {
    const f = this.dynamicFormService.loadModule();
    const injector = Injector.create({ providers: [], parent: this._injector });
    const cmpRef = f.create(injector, [], null, this._m);
    this.destroyCmpRef();
    this.tplRef.clear();
    const mergeInstance: any = this.mergeInstance();
    cmpRef.instance = Object.assign(cmpRef.instance, {
      config: this.dynamicFormService.config,
      layout: this.layout,
      dynamicSubmit: this.dynamicSubmit,
      valueChanges: this.valueChanges,
      ...mergeInstance,
    });
    this.tplRef.insert(cmpRef.hostView);
    this.cmpRef = cmpRef;
  }

  get value() {
    if (!this.cmpRef) {
      return {};
    }

    return this.cmpRef['_component'].getFormValue();
  }
}
