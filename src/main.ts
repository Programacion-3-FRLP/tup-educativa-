import * as Sentry from "@sentry/angular";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

Sentry.init({
    dsn: "https://655c501371718943a75cbc6ee1580abc@o4511592327544832.ingest.us.sentry.io/4511592327741440",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1,
    sendDefaultPii: true
})

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));