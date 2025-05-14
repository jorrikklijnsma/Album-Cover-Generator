import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store'; // Import your store
import { loadSettings } from './store/settingsSlice'; // Action to load initial settings

// Dispatch loadSettings to load API key from localStorage on app start
store.dispatch(loadSettings());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
