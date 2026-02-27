import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { provideApiConfig } from './core/config/api.config';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    BsDatepickerModule.forRoot().providers!,
    provideAnimations(),
    ...provideApiConfig(),
    NgxMaskModule.forRoot({
      showMaskTyped: false,
  }).providers!,

  ]
};
