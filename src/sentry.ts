import * as Sentry from '@sentry/browser';
import {BrowserTracing} from '@sentry/tracing';

if (import.meta.env.VITE_APP_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
    });
}
