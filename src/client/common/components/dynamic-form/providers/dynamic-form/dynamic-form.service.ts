import { NgModule, Injectable, Compiler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { factoryForm } from '../../core/dynamic-form';

@Injectable()
export class DynamicFormService {
  private _config: any; // 表单配置文件
  private _layout: any; // 表单布局配置
  private _nzLayout: string;
  constructor(private _compiler: Compiler) {}

  /**
   * 创建动态组件的NgModule
   */
  private factoryModule() {
    const TemComponent = factoryForm(this.config, this.layout, this.nzLayout);
    return NgModule({
      declarations: [TemComponent],
      imports: [
        CommonModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
      ],
    })(class {});
  }

  /**
   * 价值NgModule
   */
  loadModule(): any {
    const factories = this._compiler.compileModuleAndAllComponentsSync(this.factoryModule());
    return factories.componentFactories.slice(-1)[0];
  }

  set config(config: any) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set layout(layout: any) {
    this._layout = layout;
  }

  get layout() {
    return this._layout;
  }

  get nzLayout() {
    return this._nzLayout;
  }

  set nzLayout(value: string) {
    this._nzLayout = value;
  }
}
