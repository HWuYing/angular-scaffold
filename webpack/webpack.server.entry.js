const path = require('path');
const { ContextReplacementPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const rxjsPathMappingImport = 'rxjs/_esm5/path-mapping';
const rxPaths = require(require.resolve(rxjsPathMappingImport));
const baseDir = process.cwd();
const stylesDir = [path.join(baseDir, 'src/styles/theme.less'), path.join(baseDir, 'src/styles/theme.scss')];

const { isAbsolute } = path;

module.exports = (jsRules, cssRules, isDebug) => {
  return {
    entry: {
      main: path.join(baseDir, 'src/client/main.server.ts'),
    },
    resolve: { 
      alias: rxPaths(path.join(baseDir, 'node_modules')),
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },
      {
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true } 
      },
      {
        test: /\.js$/,
        exclude: /(ngfactory|ngstyle).js$/,
        enforce: 'pre' 
      },
      ...cssRules.more(['css', 'less', 'sass'], {
        include: [stylesDir],
      }),
      ...cssRules.more(['css', 'less', 'sass'], {
        exclude: stylesDir,
      }, 'to-string-loader'),
      jsRules.ngTs({ })],
    },
    externals: [
      /^@angular/, (context, request, callback) => {
        if (/^\.{0,2}\//.test(request) || isAbsolute(request)) {
          return callback();
        }
        try {
          require.resolve(request);
          callback(null, request);
        } catch(e) {
          callback();
        }
      },
    ],
    plugins: [
      new ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/),
      new AngularCompilerPlugin({
        mainPath: path.join(baseDir, 'src/client/main.server.ts'),
        entryModule: path.join(baseDir, 'src/client/app/app.server.module#AppServerModule'),
        tsConfigPath: path.join(baseDir, 'src/client/ts.server.json'),
        skipCodeGeneration: true,
        nameLazyFiles: true,
        forkTypeChecker: true,
        platform: 1,
      }),
    ],
  };
}
