import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import keycloak from './keycloak';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function clearKeycloakHashFromUrl() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash;
  if (!hash) return;
  if (hash.includes('state=') || hash.includes('session_state=') || hash.includes('code=')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false }).then(() => {
  clearKeycloakHashFromUrl();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}).catch((error) => {
  console.error('Failed to initialize Keycloak:', error);
});
