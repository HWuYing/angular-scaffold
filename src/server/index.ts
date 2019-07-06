import path from 'path';
import express, { Request, Response, NextFunction} from 'express';
import { renderServer } from './render/renderApp';
import serializationSource, { Source } from './render/serializationSource';

const app = express();

app.use(express.static(path.resolve(__dirname, './public')));

app.get('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const source: Source<string> = serializationSource();
  let html = ``;
  try {
    html = await renderServer(req, res, next);
  } catch(e) {
    console.log(e);
    next();
  }
  res.write(`<!doctype html>`);
  res.write(`<html><head><title>angular-scaffold</title>`);
  res.write(`<base href="/">`);
  res.write(`<meta charset="utf-8">`);
  res.write(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  res.write(`<meta http-equiv="x-ua-compatible" content="ie=edge">`);
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
