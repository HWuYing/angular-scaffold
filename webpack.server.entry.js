const path = require('path');
const { ContextReplacementPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const rxjsPathMappingImport = 'rxjs/_esm5/path-mapping';
const rxPaths = require(require.resolve(rxjsPathMappingImport));
const stylesDir = path.join(__dirname, 'src/styles');
const clientDir = path.join(__dirname, 'src/client');
const { isAbsolute } = path; 

module.exports = (jsRules, cssRules, isDebug) => {
  return {
    entry: {
      main: [
        path.join(__dirname, 'src/client/main.server.ts'),
      ],
    },
    resolve: { 
      alias: rxPaths(path.join(__dirname, 'node_modules')),
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
      cssRules.sass({
        include: clientDir,
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
        mainPath: path.join(__dirname, 'src/client/main.server.ts'),
        entryModule: path.join(__dirname, 'src/client/app/app.server.module#AppServerModule'),
        tsConfigPath: path.join(__dirname, 'src/client/ts.server.json'),
        skipCodeGeneration: true,
        nameLazyFiles: true,
        forkTypeChecker: true,
        platform: 1,
      }),
    ],
  };
}
