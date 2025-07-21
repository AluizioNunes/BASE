// src/serviceWorkerRegistration.ts
// ATENÇÃO: Para uso com Vite, recomenda-se utilizar um plugin como vite-plugin-pwa para registro automático do service worker.
// O registro manual pode ser adaptado conforme a necessidade.
// Função para registrar o service worker (PWA) padrão do CRA
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        // Atualização automática
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nova versão disponível
                  window.location.reload();
                }
              }
            };
          }
        };
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
} 