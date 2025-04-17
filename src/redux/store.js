import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import cartReducer from './cart/cartSlice';
import authReducer from './auth/authSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
