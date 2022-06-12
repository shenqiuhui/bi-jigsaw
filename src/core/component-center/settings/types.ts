import { RegisterBaseType } from '@/core/register';
import { PageSettingType, SettingType } from '@/core/render-engine';

export interface SettingDefaultProps {
  hasTab: boolean;
  type: string;
  activeTab: string;
  pageId: string;
  spaceId: string;
  widgetId: string;
  onWatchInfoChange?: (info: any) => void;
  onPageSettingChange?: (pageSetting: PageSettingType) => void;
  onDataSettingChange?: (dataSettings: SettingType['data']) => void;
  onStyleSettingChange?: (styleSettings: SettingType['style']) => void;
}

export interface PageSettingProps extends SettingDefaultProps {
  settings: PageSettingType;
}

export interface TabsSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface TableSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface LineSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface BarSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface PieSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface ComplexSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface TextSettingProps extends SettingDefaultProps {
  settings: SettingType;
}

export interface PlanDataType {
  planId: number;
  planName: string;
}

export interface WidgetSettingType extends RegisterBaseType {
  hasTab: boolean;
}
