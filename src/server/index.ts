import path from 'path';
import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
import express, { Request, Response, NextFunction} from 'express';
import serializationSource, { Source } from './serializationSource';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

const app = express();
enableProdMode();
global['Event'] = null;

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../build/server/main');

const render = ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
});

const renderServer = async (req: Request, res: Response, next: NextFunction): Promise<string> => {
  return new Promise((resolve, reject) => {
    render(req.path, {
      req,
      res,
      url: req.path,
      document: `<app-root></app-root>`,
    } as any, (error, html: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(html);
      }
    })
  })
}

app.use(express.static(path.resolve(process.cwd(), 'build/public')));

app.get('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const source: Source<string> = serializationSource();
  let html = ``;
  try {
    html = await renderServer(req, res, next);
  } catch(e) {
    next();
  }
  res.write(`<!doctype html>`);
  res.write(`<html><head><title>title</title>`);
  res.write(`<base href="/">`);
  res.write(`<meta charset="utf-8">`);
  res.write(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  res.write(`<meta http-equiv="x-ua-compatible" content="ie=edge">`)
  res.write(source.styleSheet.join(''));
  res.write(`</head><body>`);
  res.write(html);
  res.write(source.javascript.join(''));
  res.write(`</body></html>`);
  res.end();
});

app.listen('3000', () => {
  console.log('The server is running at http://localhost:3000/');
});
