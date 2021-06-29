import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.info = { ...action.payload, connected: false };
    },
    setUserConnected: (state, action) => {
      state.info.connected = action.payload;
    },
  },
});

const { setUser, setUserConnected } = userSlice.actions;

const getUserInfo = (state) => state.userReducer.info;

export { userSlice, setUser, setUserConnected, getUserInfo };
