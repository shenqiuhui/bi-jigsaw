import { IPageConfig } from '@/core/render-engine/types';

export interface IDashboardState {
  spaceData: ISpaceData;
  pageConfig: IPageConfig;
  pageStatus: string;
};

export interface ISpaceData {
  spaceId: number;
  spaceName: string;
}

export interface IRootState {
  dashboard: IDashboardState;
};
