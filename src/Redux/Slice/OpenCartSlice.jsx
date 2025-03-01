import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "opencart",
  initialState: {
    isOpen: false, 
    isFavOpen : false,
    isSearchOpen : false,
    isProductDetailOpen : false,
    position: { x: 0, y: 0 },
  },
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    openFav: (state) => {
      state.isFavOpen = true;
    },
    closeFav: (state) => {
      state.isFavOpen = false;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    openProductDetail: (state, action) => {
      state.isProductDetailOpen = true;
      state.position = action.payload; // Store click position
    },
    closeProductDetail: (state) => {
      state.isProductDetailOpen = false;
      state.position = { x: 0, y: 0 };
    },
  },
});

export const { openCart, closeCart, openFav, closeFav, openSearch, closeSearch, openProductDetail, closeProductDetail } = cartSlice.actions;
export default cartSlice.reducer;
