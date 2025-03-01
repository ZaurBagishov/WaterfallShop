import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../Firebase/Config";
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

// Helper function to get the current user's ID
const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

// **Async Actions for Firebase Sync**


export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return rejectWithValue("User not logged in");

      const favRef = collection(db, "users", userId, "favorites");
      const querySnapshot = await getDocs(favRef);

      let favorites = [];
      querySnapshot.forEach((doc) => {
        favorites.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched Favorites:", favorites);
      return favorites; // Redux state updates with fetched data
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const addToFavoritesFirebase = createAsyncThunk(
  "favorites/addToFavoritesFirebase",
  async (product, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return rejectWithValue("User not logged in");

      if (!product.id) return rejectWithValue("Invalid product data");

      // Fix: Ensure Firestore document reference uses a string ID
      const favRef = doc(db, "users", userId, "favorites", String(product.id));

      await setDoc(favRef, product);
      return product;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavoritesFirebase = createAsyncThunk(
  "favorites/removeFromFavoritesFirebase",
  async (productId, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return rejectWithValue("User not logged in");

      if (!productId) return rejectWithValue("Invalid product ID");

      // Fix: Ensure Firestore document reference uses a string
      const favRef = doc(db, "users", userId, "favorites", String(productId));

      await deleteDoc(favRef);

      return productId;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

// **Favorites Slice**
const FavoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        console.log("Redux State Updated with Favorites:", action.payload); // Debugging log
        state.items = action.payload;
      })
      .addCase(addToFavoritesFirebase.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromFavoritesFirebase.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToFavoritesFirebase.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromFavoritesFirebase.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectUniqueFavItemCount = (state) => state.favorites.items.length;

export default FavoritesSlice.reducer;
