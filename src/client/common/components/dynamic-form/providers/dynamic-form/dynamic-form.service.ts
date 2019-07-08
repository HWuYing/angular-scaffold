import { CommonModule } from '@angular/common';
import { Compiler, Inject, Injectable, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SerializationConfig } from '../../core/serialization-config';
import { factoryForm } from '../../core/dynamic-form';
import { DynamicCompilerToken } from '../dynamic-compiler-provider';
import { NzZorroImport } from '../nz-zorro-lazy';

const temComponentFactoryCache = {};

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
  private factoryModule(serialization: SerializationConfig) {
    return NgModule({
      declarations: [factoryForm(serialization, this.templateMap)],
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
    const serialization = SerializationConfig.factorySerializationConfig(this.config, this.layout, this.nzLayout);
    const hashKey = serialization.hashKey;
    if (temComponentFactoryCache[hashKey]) {
      return Promise.resolve([temComponentFactoryCache[hashKey], serialization, this.templateMap]);
    }
    const factories = this._compiler.compileModuleAndAllComponentsAsync(this.factoryModule(serialization));
    return factories.then((f: any) => {
      temComponentFactoryCache[hashKey] = f.componentFactories.slice(-1)[0];
      return [temComponentFactoryCache[hashKey], serialization, this.templateMap];
    });
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
