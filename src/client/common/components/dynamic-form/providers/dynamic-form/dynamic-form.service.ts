import { CommonModule } from '@angular/common';
import { Compiler, Injectable, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { factoryForm } from '../../core/dynamic-form';

@Injectable()
export class DynamicFormService {
  private underConfig: any; // 表单配置文件
  private underLayout: any; // 表单布局配置
  private underNzLayout: string;
  private underTemplateMap: object;
  constructor(private _compiler: Compiler) {}

  /**
   * 创建动态组件的NgModule
   */
  private factoryModule() {
    const TemComponent = factoryForm(this.config, this.layout, this.templateMap, this.nzLayout);
    return NgModule({
      declarations: [TemComponent],
      imports: [
        CommonModule,
        NgZorroAntdModule,
        ReactiveFormsModule
      ]
    })(class {});
  }

  /**
   * 价值NgModule
   */
  loadModule(): any {
    const factories = this._compiler.compileModuleAndAllComponentsSync(this.factoryModule());
    return factories.componentFactories.slice(-1)[0];
  }

  set templateMap(map: any) {
    this.underTemplateMap = map;
  }

  get templateMap() {
    return this.underTemplateMap;
  }

  set config(config: any) {
    this.underConfig = config;
  }

  get config() {
    return this.underConfig;
  }

  set layout(layout: any) {
    this.underLayout = layout;
  }

  get layout() {
    return this.underLayout;
  }

  get nzLayout() {
    return this.underNzLayout;
  }

  set nzLayout(value: string) {
    this.underNzLayout = value;
  }
}
