import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISpaceData, IPageConfig } from '../types';

const initialState = {
  spaceData: {
    spaceId: 0,
    spaceName: ''
  },
  pageConfig: {},
  pageStatus: 'edit'
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardConfig: (state, action: PayloadAction<IPageConfig>) => {
      return { ...state, pageConfig: { ...state.pageConfig, ...action.payload } };
    },
    setDashboardStatus: (state, action: PayloadAction<string>) => {
      return { ...state, pageStatus: action.payload };
    },
    setSpaceConfig: (state, action: PayloadAction<ISpaceData>) => {
      return { ...state, spaceData: { ...action.payload } };
    }
  }
});

export const { setDashboardConfig, setDashboardStatus, setSpaceConfig } = dashboardSlice.actions;
export default dashboardSlice.reducer;
