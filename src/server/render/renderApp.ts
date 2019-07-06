import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { Request, Response, NextFunction} from 'express';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import  './polyfills';
import { LAZY_MODULE_MAP, AppServerModule, AppServerModuleNgFactory } from '../../../build/server/main';

enableProdMode();

const render = ngExpressEngine({
  bootstrap: AppServerModule,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
});

export const renderServer = async (req: Request, res: Response, next?: NextFunction): Promise<string> => {
  const startTimer = new Date().getTime();
  return new Promise((resolve, reject) => render(req.path, { req, res,  document: `<app-root></app-root>`  } as any, (error: any, html: string) => {
    if (error) {
      console.log(error);
      next(error);
    } else {
      console.log('[page path]:    '+ req.path);
      console.log('[render timer]: ' + (new Date().getTime() - startTimer) + 'ms');
      resolve(html);
    }
  }));
};
