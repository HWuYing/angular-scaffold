import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/bootloader';
import { get } from 'lodash/fp';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

const main = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule);
};

if (environment.hmr) {
  if (get('hot')(module)) {
    hmrBootstrap(module, main);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
  }
} else {
  bootloader(main);
}
