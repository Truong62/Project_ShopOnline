import AppRoutes from './routes/routes';
import 'primeicons/primeicons.css';
import React from 'react';
import ScrollToTop from './components/ScrollToTop';

/**
 *
 * @returns {Element}
 * @constructor
 */
function App() {
  return (
    <div>
      <ScrollToTop />
      <AppRoutes />
    </div>
  );
}

export default App;
