import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // Asegúrate de que este archivo exista en 'src/app/app.component.ts'

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));