const regExp = new RegExp('^\\.\\.\\/\\.\\.\\/\\.\\.\\/build([\\s\\S]*)');
module.exports = (jsRules, cssRules, isDebug) => {
  return {
    externals: [(context, request, callback) => {
      if (regExp.test(request)) {
        const _request = isDebug ? '' : request.replace(regExp, '.$1');
        return callback(null, 'commonjs ' + _request);
      }
      callback();
    }]
  };
};
