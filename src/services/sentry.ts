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

export default Sentry; 