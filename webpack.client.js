const path = require('path');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');
const stylesDir = path.join(__dirname, 'src/styles');
const clientDir = path.join(__dirname, 'src/client');

const rxjsPathMappingImport = 'rxjs/_esm5/path-mapping';
const rxPaths = require(require.resolve(rxjsPathMappingImport));

module.exports = (jsRules, cssRules, isDebug) => {
  const sassRules = cssRules.sass({
    include: clientDir,
    exclude: stylesDir,
  });
  sassRules.use.shift();
  if (!isDebug) {
    sassRules.use.shift();
  }
  sassRules.use.unshift({ loader: 'to-string-loader' });
  return {
    entry: {
      style: [
        './src/styles/theme.less',
        './src/styles/theme.scss'
      ],
      polyfill: [
        './src/client/polyfills.ts', 
        '@angular-devkit/build-angular/src/angular-cli-files/models/jit-polyfills.js'
      ],
    },
    resolve: { 
      alias: rxPaths(path.join(__dirname, 'node_modules')),
    },
    module: {
      rules: [{
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
            customAttrAssign: [ /\)?\]?=/ ]
          },
        },
        { test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true } },
        { test: /\.js$/,
          exclude: /(ngfactory|ngstyle).js$/,
          enforce: 'pre' },
        jsRules.ngOptimizerJs({
          include: clientDir,
        }),
        cssRules.css({
          include: stylesDir,
        }),
        cssRules.less({
          include: stylesDir,
        }),
        cssRules.sass({
          include: stylesDir,
        }),
        sassRules,
        jsRules.ngTs({
          include: clientDir,
        })],
    },
    plugins: [
      new AngularCompilerPlugin({
        mainPath: path.join(__dirname, 'src/client/main.ts'),
        entryModule: path.join(__dirname, 'src/client/app/app.module#AppModule'),
        tsConfigPath: path.join(__dirname, 'ts.client.json'),
        // contextElementDependencyConstructor: ContextElementDependency,
        skipCodeGeneration: true,
        sourceMap: isDebug,
        nameLazyFiles: true,
        forkTypeChecker: true,
      }),
    ],
  };
};