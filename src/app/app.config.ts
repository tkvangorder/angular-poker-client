import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './error-handling/global-error-handler';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
      deps: [], // Add any dependencies here needed for the error handler.
    },
  ],
};
