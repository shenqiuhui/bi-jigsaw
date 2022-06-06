import { IPageConfig } from '@/core/render-engine/types';

export interface IUserInfo {
  userId: string;
  userName: string;
  realName: string;
  email: string;
  mobile: string;
}

export interface IDashboardState {
  pageConfig: IPageConfig;
  pageStatus: string;
}

export interface IRootState {
  user: IUserInfo;
  dashboard: IDashboardState;
}
