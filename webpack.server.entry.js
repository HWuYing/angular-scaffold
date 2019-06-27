const path = require('path');
const { ContextReplacementPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const rxjsPathMappingImport = 'rxjs/_esm5/path-mapping';
const rxPaths = require(require.resolve(rxjsPathMappingImport));
const stylesDir = path.join(__dirname, 'src/styles');
const clientDir = path.join(__dirname, 'src/client');
const { isAbsolute } = path; 
console.log(1234);
module.exports = (jsRules, cssRules, isDebug) => {
  const sassRules = cssRules.sass({
    include: clientDir,
  });
  sassRules.use.shift();
  if (!isDebug) {
    sassRules.use.shift();
  }
  sassRules.use.unshift({ loader: 'to-string-loader' });
  return {
    // entry: {
    //   main: [ path.join(__dirname, 'src/client/main.server.ts')],
    //   'polyfills-es5': [ '@angular-devkit/build-angular/src/angular-cli-files/models/es5-polyfills.js' ],
    // },
    resolve: { 
      alias: rxPaths(path.join(__dirname, 'node_modules')),
    },
    module: {
      rules: [
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
      sassRules,
      { test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.tsx?)$/,
        use: 
         [ '@ngtools/webpack/src/index.js' ] }]
    },
    externals: [
      /^@angular/, (context, request, callback) => {
        // Absolute & Relative paths are not externals
        if (/^\.{0,2}\//.test(request) || isAbsolute(request)) {
          return callback();
        }

          require.resolve(request);
          callback(null, request);
        
      },
    ],
    plugins: [
      new ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/),
      new AngularCompilerPlugin({
        mainPath: path.join(__dirname, 'src/client/main.server.ts'),
        entryModule: path.join(__dirname, 'src/client/app/app.server.module#AppServerModule'),
        tsConfigPath: path.join(__dirname, 'src/client/ts.client.json'),
        skipCodeGeneration: true,
        sourceMap: isDebug,
        nameLazyFiles: true,
        platform: 1,
        forkTypeChecker: true,
      }),
    ],
  };
}
