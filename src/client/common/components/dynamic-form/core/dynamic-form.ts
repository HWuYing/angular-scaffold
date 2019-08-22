import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, EventEmitter, Input, NgModuleRef, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,  FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, startWith, switchMap, take, tap } from 'rxjs/operators';
import { angularMetadata } from '../providers/metadata';
import { SerializationConfig } from './serialization-config';

/**
 * 动态component
 * @param config 表单配置
 * @param layout 表单布局
 */
export const factoryForm = (serializationConfig: SerializationConfig) => {
  class TemComponent implements OnInit, OnDestroy {
    @Output() readonly dynamicSubmit: EventEmitter<any> = new EventEmitter();
    @Output() readonly valueChanges: EventEmitter<any> = new EventEmitter();
    @Input() serialization: SerializationConfig;
    @Input() templateMap: object;
    @Input() set fieldStore(value: object) {
      this.underFieldStore = value || {};
    }
    private underFieldStore: any = {};
    private subscription: Subscription = new Subscription();
    private subject: Subject<void> = new Subject();
    public validateForm: FormGroup;

    constructor(
      private fb: FormBuilder
    ) { }

    ngOnInit() {
      if (!this.validateForm) {
        this.resetValidateForm();
      }
      this.initAsyncSubmit();
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
      this.subject.unsubscribe();
    }

    /**
     * 初始化异步验证器
     */
    private initAsyncSubmit() {
      this.subscription.add(this.subject.pipe(
        tap(() => this.validateForm.markAsDirty()),
        switchMap(() => this.validateForm.statusChanges.pipe(
          startWith(this.validateForm.status),
          filter((status => status !== 'PENDING')),
          take(1)
        )),
        filter(status => status === 'VALID')
      ).subscribe((valid: string) => this.dynamicSubmit.emit(this.validateForm.value)));
    }

    /**
     * 遍历controls
     * @param validateForm form
     * @param back 回掉函数
     */
    private eachForm(validateForm: FormGroup | FormControl | FormArray, back: (control?: AbstractControl) => void): boolean {
      if (validateForm instanceof FormArray) {
        validateForm.controls.forEach((v: any) => this.eachForm(v, back));
      } else if (validateForm instanceof FormGroup) {
        const { controls } = validateForm;
        Object.keys(controls).forEach((controlKey: string) => {
          this.eachForm(controls[controlKey] as any, back);
        });
      } else if (validateForm instanceof FormControl) {
        if (back) {
          back(validateForm);
        }
      }
      return false;
    }

    /**
     * 创建form
     * @param fieldStore 数据
     */
    private createValidateForm(fieldStore?: any) {
      this.validateForm = this.serialization.generateFormGroup(this.fb, fieldStore);
      this.subscription.add(
        this.validateForm.valueChanges.subscribe((value: any) =>
          this.valueChanges.emit(value)
        )
      );
    }

    /**
     * 验证表单
     */
    validationForm() {
      this.eachForm(this.validateForm, (control: FormControl) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }

    /**
     * 表单提交 对应onSubmit事件
     * @param event MoustEvent
     */
    onSubmit(event?: any, isAsync?: boolean) {
      const validateForm = this.validateForm;
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      // 验证表单
      this.validationForm();
      isAsync ? this.subject.next() : this.dynamicSubmit.emit(validateForm.value);
    }

    /**
     * 异步校验
     * @param event 事件
     */
    onSubmitAsync(event?: any) {
      this.onSubmit(event, true);
    }

    /**
     * 同步Submit
     */
    onSubmitSync(event?: any) {
      this.onSubmit(event);
    }

    /**
     * 重置表单
     * @param event MoustEvent
     */
    resetForm(event?: MouseEvent) {
      if (event) {
        event.preventDefault();
      }
      if (this.serialization.typeOrInclude(['formArray', 'table'])) {
        this.createValidateForm(this.initialValues);
      } else if (this.validateForm) {
        this.validateForm.reset(this.initialValues);
        this.eachForm(this.validateForm, (control: AbstractControl) => {
          control.markAsPristine();
          control.updateValueAndValidity();
        });
      }
    }

    /**
     * 从新设置表单的值
     * @param fieldStore 表单值 {}
     */
    resetValidateForm(fieldStore?: any) {
      if (fieldStore) {
        this.underFieldStore = fieldStore;
      }
      this.createValidateForm(this.underFieldStore);
      // const underFieldStore = this.underFieldStore;
      // if (this.validateForm && !this.serialization.typeOrInclude(['formArray', 'table'])) {
      //   this.validateForm.reset(underFieldStore);
      // } else {
      //   this.createValidateForm(underFieldStore);
      // }
    }

    /**
     * 合并设置表单值
     */
    patchValue(value: { [key: string]: any; }, options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }): void {
      this.validateForm.patchValue(value, options);
    }

    /**
     * 获取表单数据 排除disable
     */
    getFormValue(): object {
      return this.validateForm ? this.validateForm.value : {};
    }

    /**
     * 获取所有数据 包含disabled
     */
    getRawValue(): object {
      return this.validateForm ? this.validateForm.getRawValue() : {};
    }

    get initialValues() {
      return this.serialization.initialValues;
    }

    get fieldStore() {
      return this.underFieldStore;
    }
  }

  return angularMetadata(Component({
    template: serializationConfig.generateTemplate(), // 获取动态的template
    providers: [FormBuilder],
    host: {
      '[class.dynamic-form]': `serialization.layout.nzLayout !== 'inline'`,
      '[class.dynamic-size-small]': `serialization.layout.size === 'small'`
    }
  }), TemComponent, [FormBuilder]);
};
