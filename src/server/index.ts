import path from 'path';
import express from 'express';
import serializationSource, { Source } from './serializationSource';

// try {
//   const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../build/server/main');
//   console.log(AppServerModuleNgFactory);
//   console.log(LAZY_MODULE_MAP);
// } catch {
// }


const app = express();

app.use(express.static(path.resolve(process.cwd(), 'build/public')));

app.get('*', async (req, res, next): Promise<void> => {
  const source: Source<string> = serializationSource();
  res.write(`<!doctype html>`);
  res.write(`<html><head><title>title</title>`);
  res.write(`<base href="/">`);
  res.write(`<meta charset="utf-8"> `);
  res.write(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  res.write(`<meta http-equiv="x-ua-compatible" content="ie=edge">`)
  res.write(source.styleSheet.join(''));
  res.write(`</head><body>`);
  res.write(`<app-root></app-root>`);
  res.write(source.javascript.join(''));
  res.write(`</body></html>`);
  res.end();
});

app.listen('3000', () => {
  console.log('The server is running at http://localhost:3000/');
});
