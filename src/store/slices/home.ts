import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeStateType } from '../types';

const initialState: HomeStateType = {
  theme: 'light',
};

const homeSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (_state: HomeStateType, action: PayloadAction<string>) => {
      return { theme: action.payload };
    }
  }
});

export const { setTheme } = homeSlice.actions;
export default homeSlice.reducer;
