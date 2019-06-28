module.exports = (jsRules) => {
  return {
    entry: {
      common: [
        '@angular/compiler',
        '@angular/animations',
      ],
     },
     module: {
       rules: [
        jsRules.ngOptimizerJs(),
       ],
     }
  };
};