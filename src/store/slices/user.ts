import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfoType } from '../types';

const initialState: UserInfoType = {
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
    setUserInfo: (_state: UserInfoType, action: PayloadAction<UserInfoType>) => {
      return action.payload;
    }
  }
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
