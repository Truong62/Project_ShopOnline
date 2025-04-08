import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import DashboardMain from '../dashboard/src/main';
import { HelmetProvider } from 'react-helmet-async';

// Get the root element from your HTML
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          {/* <App /> */}
          <DashboardMain />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
