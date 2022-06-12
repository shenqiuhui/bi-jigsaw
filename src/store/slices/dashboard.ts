import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageConfigType } from '@/core/render-engine';

interface InitialState {
  pageConfig: Object,
  pageStatus: string
};

const initialState: InitialState = {
  pageConfig: {},
  pageStatus: 'edit'
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardConfig: (state: InitialState, action: PayloadAction<PageConfigType>) => {
      return { ...state, pageConfig: { ...state.pageConfig, ...action.payload } };
    },
    setDashboardStatus: (state: InitialState, action: PayloadAction<string>) => {
      return { ...state, pageStatus: action.payload };
    }
  }
});

export const { setDashboardConfig, setDashboardStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
