import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app.routes';
 
// import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
 import {provideTranslateService, TranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(AppRoutes), provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    }),
  ]
};


 