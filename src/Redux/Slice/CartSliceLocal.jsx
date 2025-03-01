import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { items: [],tempItems: [], totalPrice: 0 };
};

const initialState = loadCartFromStorage()

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    AddToCart(state, action) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.tempItems = [...state.items];
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalPrice += item.price;
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice -= item.price;
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    RemoveFromCart(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        state.totalPrice -= item.price * item.quantity; // Subtract total item cost
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
      state.tempItems = [...state.items];
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

// export const selectTotalItemCount = (state) =>
//   state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectUniqueItemCount = (state) => state.cart.items.length;

export const {
  AddToCart,
  RemoveFromCart,
  incrementQuantity,
  decrementQuantity,
} = CartSlice.actions;

export default CartSlice.reducer;
