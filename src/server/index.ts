import path from 'path';
import express, { Request, Response, NextFunction} from 'express';
import './vpn';
import { renderServer } from './render/renderApp';
import serializationSource, { Source } from './render/serializationSource';

const app = express();

app.use(express.static(path.resolve(__dirname, './public')));

app.get('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const source: Source<string> = serializationSource();
  const html = [];
  html.push(`<!doctype html>`);
  html.push(`<html><head>`);
  html.push(`<title>angular-scaffold</title>`);
  html.push(`<base href="/">`);
  html.push(`<meta charset="utf-8">`);
  html.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  html.push(`<meta http-equiv="x-ua-compatible" content="ie=edge">`);
  html.push(source.styleSheet.join(''));
  html.push(`</head><body>`);
  html.push(`<app-root></app-root>`);
  html.push(source.javascript.join(''));
  html.push(`</body></html>`);
  // res.write(await renderServer(req, res, html.join(''), next));
  res.write(html.join(''));
  res.end();
});

app.listen('3000', () => {
  console.log('The server is running at http://localhost:3000/');
});
