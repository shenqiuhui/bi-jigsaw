import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo } from '../types';

const initialState: IUserInfo = {
  userId: '',
  userName: '',
  realName: '',
  email: '',
  mobile: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (_state: IUserInfo, action: PayloadAction<IUserInfo>) => {
      return action.payload;
    }
  }
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
