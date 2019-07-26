import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
    public validateForm: FormGroup;
    private fb: FormBuilder;
    constructor() {
      this.fb = new FormBuilder();
    }

    ngOnInit() {
      if (!this.validateForm) {
        this.resetValidateForm();
      }
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
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
    onSubmit(event?: any) {
      const validateForm = this.validateForm;
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      // 验证表单
      this.validationForm();
      if (validateForm.valid) {
        this.dynamicSubmit.emit(validateForm.value);
      }
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

  return  Component({
    template: serializationConfig.generateTemplate(), // 获取动态的template
    providers: [FormBuilder],
    host: {
      '[class.dynamic-form]': `this.serialization.layout.nzLayout !== 'inline'`
    }
  })(TemComponent);
};
