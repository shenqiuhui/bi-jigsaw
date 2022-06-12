import { PageConfigType } from '@/core/render-engine';

export interface UserInfoType {
  userId: string;
  userName: string;
  realName: string;
  email: string;
  mobile: string;
}

export interface DashboardStateType {
  pageConfig: PageConfigType;
  pageStatus: string;
}

export interface RootStateType {
  user: UserInfoType;
  dashboard: DashboardStateType;
}
