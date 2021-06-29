import { createSlice } from '@reduxjs/toolkit';

let themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'light',
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

let { setTheme } = themeSlice.actions;

let getTheme = (state) => state.themeReducer.theme;

export { themeSlice, setTheme, getTheme };

