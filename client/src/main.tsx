import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/sonner.tsx';
import { ThemeProvider } from './components/global/theme-provider.tsx';
import { QueryProvider } from './lib/queryProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position='top-center' />
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryProvider>
          <App />
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
