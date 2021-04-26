import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.info = action.payload
        },
    },
})

const { setUser } = userSlice.actions

const getUserInfo = (state) => state.userReducer.info

export { userSlice, setUser, getUserInfo }
