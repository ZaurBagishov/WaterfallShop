import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    email: null,
    userName: null,
    userId: null,

}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN: (state, action) => {
      state.isLoggedIn = true
      state.email = action.payload.email
      state.userName = action.payload.userName
      state.userId = action.payload.userId
    },
    LOGOUT: (state) => {
      state.isLoggedIn = false
      state.email = null
      state.userName = null
      state.userId = null
    }
    }
})

export const {LOGIN, LOGOUT } = AuthSlice.actions
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectEmail = (state) => state.auth.email
export const selectUserName = (state) => state.auth.userName
export const selectUserId = (state) => state.auth.userId

export default AuthSlice.reducer