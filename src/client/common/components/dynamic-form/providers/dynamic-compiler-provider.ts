import { COMPILER_OPTIONS, Compiler, CompilerFactory, InjectionToken } from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

const createCompiler = () => {
  let compiler: Compiler;
  return (compilerFactory: CompilerFactory) => {
    if (compiler) {
      return compiler;
    }
    compiler = compilerFactory.createCompiler();
    return compiler;
  };
};

export const DynamicCompilerToken = new InjectionToken('dynamic-compiler-token');
export const DynamicCompilerFactory = new InjectionToken('dynamic-compiler-factory');

export const DYNAMIC_COMPILER_PROVIDER = [
  {provide: COMPILER_OPTIONS, useValue: { }, multi: true},
  {provide: DynamicCompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
  {provide: DynamicCompilerToken, useFactory: createCompiler(), deps: [DynamicCompilerFactory]},
];
