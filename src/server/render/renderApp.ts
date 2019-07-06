import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { Request, Response, NextFunction} from 'express';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import  './polyfills';
import { LAZY_MODULE_MAP, AppServerModule } from '../../../build/server/main.js';

enableProdMode();

let render: any = (): string => ``;

try {
  // const { LAZY_MODULE_MAP, AppServerModule} = require('../../build/server/main');
  render = ngExpressEngine({
    bootstrap: AppServerModule,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  });
} catch (e) {
  console.log(e);
}

export const renderServer = async (req: Request, res: Response, next?: NextFunction): Promise<string> => {
  return new Promise((resolve, reject) => {
    render(req.path, {
      req,
      res,
      url: req.path,
      document: `<app-root></app-root>`,
    } as any, (error: any, html: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(html);
      }
    })
  })
}
