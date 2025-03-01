import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
  const storedCart = localStorage.getItem("favorites");
  return storedCart ? JSON.parse(storedCart) : { items: [], tempItems: [], isFav: false };
};

const initialState = getInitialState();

const FavoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        AddToFavorites(state, action) {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );
            if (!existingItem) {
                state.items.push({ ...action.payload, quantity: 1 });
                state.tempItems = [...state.items];
                localStorage.setItem("favorites", JSON.stringify(state));
                state.isFav =true
            }
        },
        RemoveFromFavorites(state, action) {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
              state.items = state.items.filter((item) => item.id !== action.payload);
            }
            state.tempItems = [...state.items];
            localStorage.setItem("favorites", JSON.stringify(state));
            state.isFav = false
          },

    }
});

export const selectUniqueFavItemCount = (state) => state.favorites.items.length;


export const {AddToFavorites, RemoveFromFavorites} = FavoritesSlice.actions

export default FavoritesSlice.reducer