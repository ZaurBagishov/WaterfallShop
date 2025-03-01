import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./Slice/AuthSlice";
import CartReducer from "./Slice/CartSlice"
import OpenCartReducer from './Slice/OpenCartSlice'
import FavoritesReducer from './Slice/FavoritesSlice'
import ProductDetailReducer from './Slice/ProductDetailSlice'


const rootReducer = combineReducers({
    auth: AuthReducer,
    cart: CartReducer,
    opencart : OpenCartReducer,
    favorites: FavoritesReducer,
    productdetail: ProductDetailReducer
    });

const store = configureStore({
    reducer: rootReducer,
    });

export default store;