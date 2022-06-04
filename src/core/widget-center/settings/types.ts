import { IPageSetting, Settings} from '@/core/render-engine/types';

export interface ISettingDefaultProps {
  hasTab: boolean;
  type: string;
  activeTab: string;
  pageId: number;
  spaceId: string;
  widgetId: string;
  onWatchInfoChange?: (info: any) => void;
  onPageSettingChange?: (pageSetting: IPageSetting) => void;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
}

export interface IPageSettingProps extends ISettingDefaultProps {
  settings: IPageSetting;
}

export interface ITabsSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface ITableSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface ILineSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface IBarSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface IPieSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface IComplexSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface ITextSettingProps extends ISettingDefaultProps {
  settings: Settings;
}

export interface IPlanData {
  planId: number;
  planName: string;
}
