import { StrictMode } from 'react';
import React from 'react';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';
import App from './App.tsx';
import { AppWrapper } from './components/common/PageMeta.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

const DashboardMain = () => {
  return (
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  );
};

export default DashboardMain;
