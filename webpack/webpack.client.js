const path = require('path');
const { ContextReplacementPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseDir = process.cwd();
const stylesDir = [path.join(baseDir, 'src/styles/theme.less'), path.join(baseDir, 'src/styles/theme.scss')];

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
      alias: rxPaths(path.join(baseDir, 'node_modules')),
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
        ...cssRules.more(['css', 'less', 'sass'], {
          exclude: stylesDir,
        }, 'to-string-loader'),
        jsRules.ngTs()],
    },
    plugins: [
      new ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/),
      new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new AngularCompilerPlugin({
        mainPath: path.join(baseDir, 'src/client/main.ts'),
        entryModule: path.join(baseDir, 'src/client/app/app.module#AppModule'),
        tsConfigPath: path.join(baseDir, 'src/client/ts.client.json'),
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
