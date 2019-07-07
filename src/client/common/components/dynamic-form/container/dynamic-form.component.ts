import {
  Component,
  ComponentRef,
  EventEmitter,
  Injector,
  Input,
  NgModuleRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DynamicFormService } from '../providers/dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [DynamicFormService]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @ViewChild('tplRef', { read: ViewContainerRef, static: true }) tplRef: ViewContainerRef;
  @Input() set templateMap(value: object) {
    this.dynamicFormService.templateMap = value;
  }
  @Input() set nzLayout(value: string) {
    this.dynamicFormService.nzLayout = value;
  }
  @Input() set layout(value: object) {
    this.dynamicFormService.layout = value;
  }
  @Input() set config(value: object | object[]) {
    this.setConfig(value);
  }
  @Input() set fieldStore(value: object) {
    this.resetFormFieldStore(value);
  }
  @Output() readonly dynamicSubmit: EventEmitter<any> = new EventEmitter();
  @Output() readonly valueChanges: EventEmitter<any> = new EventEmitter();
  private cmpRef: ComponentRef<any>;
  constructor(
    private dynamicFormService: DynamicFormService,
    private _injector: Injector,
    private _m: NgModuleRef<any>
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyCmpRef();
  }

  /**
   * 设置config值
   * @param value any
   */
  private setConfig(value: object | object[]) {
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
      fieldStore: this.value
    };
  }

  /**
   * 设置form的值
   * @param fieldStore form表单值
   */
  resetFormFieldStore(fieldStore: any): void {
    if (!this.cmpRef) {
      return;
    }
    const dynamicForm = (this.cmpRef as any)._component;
    dynamicForm.resetValidateForm(fieldStore);
  }

  /**
   * 程序调用表单提交
   */
  submit(): void {
    const dynamicForm = (this.cmpRef as any)._component;
    (dynamicForm as any).onSubmit();
  }

  /**
   * 重置表单数据
   */
  reset(): void {
    const dynamicForm = (this.cmpRef as any)._component;
    (dynamicForm as any).resetForm();
  }

  /**
   * 注销动态组件
   */
  destroyCmpRef(): void {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }

  /**
   * 加载动态组件
   */
  loadDynamicForm(): void {
    const f = this.dynamicFormService.loadModule();
    const injector = Injector.create({ providers: [], parent: this._injector });
    const cmpRef = f.create(injector, [], null, this._m);
    this.destroyCmpRef();
    this.tplRef.clear();
    this.tplRef.insert(cmpRef.hostView);
    const mergeInstance: any = this.mergeInstance();
    const instance = {
      ...cmpRef.instance,
      ...mergeInstance
    };
    Object.keys(instance).forEach((key: string) => cmpRef.instance[key] = instance[key]);
    cmpRef.instance.dynamicSubmit.subscribe(($event: object) => this.dynamicSubmit.emit($event));
    cmpRef.instance.valueChanges.subscribe(($event: object) => this.valueChanges.emit($event));

    this.cmpRef = cmpRef;
  }

  /**
   * 验证表单
   */
  validationForm() {
    if (!this.cmpRef) {
      return;
    }
    const dynamicForm = (this.cmpRef as any)._component;
    dynamicForm.validationForm();
  }

  get valid(): boolean {
    if (!this.cmpRef) {
      return true;
    }
    return (this.cmpRef as any)._component.validateForm.valid;
  }

  get value(): object {
    if (!this.cmpRef) {
      return {};
    }

    return (this.cmpRef as any)._component.getFormValue();
  }
}
