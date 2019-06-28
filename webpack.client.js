const path = require('path');
const { ContextReplacementPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const stylesDir = path.join(__dirname, 'src/styles');
const clientDir = path.join(__dirname, 'src/client');

const rxjsPathMappingImport = 'rxjs/_esm5/path-mapping';
const rxPaths = require(require.resolve(rxjsPathMappingImport));

module.exports = (jsRules, cssRules, isDebug) => {
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
      strictExportPresence: true,
      rules: [{
          test: /\.html$/,
          loader: 'raw-loader',
        },
        { test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true } },
        { test: /\.js$/,
          exclude: /(ngfactory|ngstyle).js$/,
          enforce: 'pre' },
        ...!isDebug ? [ jsRules.ngOptimizerJs() ] : [],
        ...cssRules.more(['css', 'less', 'sass'], {
          include: stylesDir,
        }),
        cssRules.sass({
          include: clientDir,
          exclude: stylesDir,
        }, 'to-string-loader'),
        jsRules.ngTs({
          include: clientDir,
        })],
    },
    plugins: [
      new ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/),
      new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new AngularCompilerPlugin({
        mainPath: path.join(__dirname, 'src/client/main.ts'),
        entryModule: path.join(__dirname, 'src/client/app/app.module#AppModule'),
        tsConfigPath: path.join(__dirname, 'src/client/ts.client.json'),
        skipCodeGeneration: true,
        sourceMap: isDebug,
        nameLazyFiles: true,
        forkTypeChecker: true,
      }),
      ...!isDebug ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsOptions: { source: false }
      })] : [],
    ],
  };
};