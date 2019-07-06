import assets from '../../../build/assets.json';
import dll from '../../../build/dll.json';
export interface Source<T> {
  javascript: Array<T>;
  styleSheet: Array<T>;
}
type serialization = () => Source<string>;

const serializationSource = (source: any) => {
  const keys = Object.keys(source).sort((a, b) => a.indexOf('main') ? -1 : a.indexOf('runtime') ? 1 : 0).filter((_key: string) => {
    return _key.indexOf('-module') === -1;
  });
  return keys.reduce((o: Source<string>, key): Source<string> => {
    let __source;
    if (!key || !(__source = source[key])) {
      return o as Source<string>;
    }
    const javascript = [].concat(__source.js || []).map((path: string) => `<script src="/${path}"></script>`);
    const styleSheet = [].concat(__source.css || []).map((path: string) => `<link rel="stylesheet" href="/${path}">`);
    return Object.assign({
      javascript: o.javascript.concat(javascript),
      styleSheet: o.styleSheet.concat(styleSheet),
    });
  }, { javascript:[], styleSheet: [] } as Source<string>);
};

const getResource = ((): serialization => {
  let json: Source<string>;
  return (): Source<string> => json ? json : json = serializationSource({
      ...dll,
      ...assets,
    });
})();

export default getResource;
