import { CommonModule } from '@angular/common';
import { Compiler, Inject, Injectable, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { factoryForm } from '../../core/dynamic-form';
import { DynamicCompilerToken } from '../dynamic-compiler-provider';
import { NzZorroImport } from '../nz-zorro-lazy';

@Injectable()
export class DynamicFormService {
  private underConfig: any; // 表单配置文件
  private underLayout: any; // 表单布局配置
  private underNzLayout: string;
  private underTemplateMap: object;
  constructor(@Inject(DynamicCompilerToken) private _compiler: Compiler) { }

  /**
   * 创建动态组件的NgModule
   */
  private factoryModule() {
    const TemComponent = factoryForm(this.config, this.layout, this.templateMap, this.nzLayout);
    return NgModule({
      declarations: [TemComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        ...NzZorroImport
      ]
    })(class {});
  }

  /**
   * 价值NgModule
   */
  async loadModule(): Promise<any> {
    // console.log('compileModuleAndAllComponentsAsync');
    // const date = new Date().getTime();
    const factories = this._compiler.compileModuleAndAllComponentsAsync(this.factoryModule());
    // console.log(new Date().getTime() - date);
    return factories.then((f: any) => f.componentFactories.slice(-1)[0]);
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
