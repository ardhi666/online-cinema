import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        isLogin:false
    },
    reducers: {
        LOGIN: (state, action) => {
            state.user = action.payload
            state.isLogin = true
        },
        LOGOUT: (state) => {
            state.user = null
            state.isLogin = false
        }
    }
})

export const {LOGIN, LOGOUT} = userSlice.actions
export const selectUser = (state) => state.user.user
export const isLogin = (state) => state.user.isLogin
export default userSlice.reducer