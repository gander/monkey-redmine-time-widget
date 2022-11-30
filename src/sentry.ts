import * as Sentry from '@sentry/browser';

if (import.meta.env.VITE_APP_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    });
}
