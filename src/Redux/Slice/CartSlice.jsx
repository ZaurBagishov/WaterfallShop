import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../Firebase/Config";
import { doc, setDoc, getDocs,getDoc, collection, deleteDoc, updateDoc } from "firebase/firestore";

// Helper function to get the current user's ID
const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

// **Async Actions to Sync with Firebase**

// Fetch Cart from Firebase
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) return rejectWithValue("User not logged in");

      const querySnapshot = await getDocs(collection(db, "users", userId, "cart"));
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items, totalPrice };
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Add to Cart in Firebase
export const addToCartFirebase = createAsyncThunk(
  "cart/addToCartFirebase",
  async (product, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) return rejectWithValue("User not logged in");

      if (!product.id) return rejectWithValue("Invalid product data");

      const cartRef = doc(db, "users", userId, "cart", String(product.id));
      await setDoc(cartRef, { ...product, quantity: 1 }, { merge: true });

      return product;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Remove from Cart in Firebase
export const removeFromCartFirebase = createAsyncThunk(
  "cart/removeFromCartFirebase",
  async (productId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) return rejectWithValue("User not logged in");

      if (!productId) return rejectWithValue("Invalid product ID");

      await deleteDoc(doc(db, "users", userId, "cart", String(productId)));
      return productId;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Increment Quantity in Firebase
export const incrementQuantityFirebase = createAsyncThunk(
  "cart/incrementQuantityFirebase",
  async (productId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) return rejectWithValue("User not logged in");

      const cartRef = doc(db, "users", userId, "cart", String(productId)); // Document reference
      const cartDoc = await getDoc(cartRef); // Fetch document

      if (cartDoc.exists()) {
        const currentQuantity = cartDoc.data().quantity;
        await updateDoc(cartRef, { quantity: currentQuantity + 1 }); // Update document
      }

      return productId;  // Returning productId to update state
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Decrement Quantity in Firebase
export const decrementQuantityFirebase = createAsyncThunk(
  "cart/decrementQuantityFirebase",
  async (productId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) return rejectWithValue("User not logged in");

      const cartRef = doc(db, "users", userId, "cart", String(productId)); // Document reference
      const cartDoc = await getDoc(cartRef); // Fetch document

      if (cartDoc.exists()) {
        const currentQuantity = cartDoc.data().quantity;
        if (currentQuantity > 1) {
          await updateDoc(cartRef, { quantity: currentQuantity - 1 }); // Update document
        }
      }

      return productId;  // Returning productId to update state
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      return rejectWithValue(error.message);
    }
  }
);

// **Cart Slice**
const CartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalPrice: 0, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.status = "idle";
      })
      .addCase(addToCartFirebase.fulfilled, (state, action) => {
        const existingItem = state.items.find((item) => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
        state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        state.status = "idle";
      })
      .addCase(removeFromCartFirebase.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        state.status = "idle";
      })
      .addCase(incrementQuantityFirebase.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload);
        if (item) {
          item.quantity += 1;
          state.totalPrice += item.price;
        }
        state.status = "idle";
      })
      .addCase(decrementQuantityFirebase.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          state.totalPrice -= item.price;
        }
        state.status = "idle";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })
      .addCase(addToCartFirebase.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })
      .addCase(removeFromCartFirebase.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })
      .addCase(incrementQuantityFirebase.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })
      .addCase(decrementQuantityFirebase.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      });
  },
});

export const selectUniqueItemCount = (state) => state.cart.items.length;

export default CartSlice.reducer;