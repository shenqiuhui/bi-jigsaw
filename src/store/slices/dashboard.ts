import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPageConfig } from '@/core/render-engine/types';
import { ISpaceData } from '../types';

interface InitialState {
  spaceData: Object,
  pageConfig: Object,
  pageStatus: string
};

const initialState: InitialState = {
  spaceData: {},
  pageConfig: {},
  pageStatus: 'edit'
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardConfig: (state: InitialState, action: PayloadAction<IPageConfig>) => {
      return { ...state, pageConfig: { ...state.pageConfig, ...action.payload } };
    },
    setDashboardStatus: (state: InitialState, action: PayloadAction<string>) => {
      return { ...state, pageStatus: action.payload };
    },
    setSpaceConfig: (state: InitialState, action: PayloadAction<ISpaceData>) => {
      return { ...state, spaceData: { ...action.payload } };
    }
  }
});

export const { setDashboardConfig, setDashboardStatus, setSpaceConfig } = dashboardSlice.actions;
export default dashboardSlice.reducer;
