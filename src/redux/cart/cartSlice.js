import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.error('Could not load state', e);
    return [];
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.error('Could not save state', e);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadState(),
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload);
      saveState(state);
    },
    updateQuantity: (state, action) => {
      const { id, color, size, quantity } = action.payload;
      const item = state.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      if (item) {
        item.quantity = quantity;
        saveState(state);
      }
    },
    updateCategory: (state, action) => {
      const { id, color, size, category } = action.payload;
      const item = state.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      if (item) {
        item.category = category;
      }
    },
    removeItem: (state, action) => {
      const { id, color, size } = action.payload;
      const newState = state.filter(
        (item) =>
          !(item.id === id && item.color === color && item.size === size)
      );
      saveState(newState);
      return newState;
    },
    buyNow: (state, action) => {
      state.push(action.payload);
      saveState(state);
    },
    setCartFromStorage: (state, action) => {
      const newCart = action.payload;
      saveState(newCart);
      return newCart;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeItem,
  buyNow,
  setCartFromStorage,
} = cartSlice.actions;
export default cartSlice.reducer;
