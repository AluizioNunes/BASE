import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://exemploPublicKey@o0.ingest.sentry.io/0",
  tracesSampleRate: 1.0,
});

// Exemplo de uso de breadcrumbs
export function logBreadcrumb(message: string, category = "custom") {
  Sentry.addBreadcrumb({
    category,
    message,
    level: "info", // Corrigido!
  });
}

// Captura global de erros não tratados
if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    Sentry.captureException(error || message);
  };
  window.onunhandledrejection = function (event) {
    Sentry.captureException(event.reason);
  };
}

export default Sentry; 