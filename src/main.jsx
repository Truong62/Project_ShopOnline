import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.scss';
import DashboardMain from '../dashboard/src/main';

// Get the root element from your HTML
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <DashboardMain />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
