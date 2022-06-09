import { IWidgetDefaultProps, IPageConfig, IWidget, Settings, IGirdProps } from '@/core/render-engine/types';

export interface ITabsWidgetProps extends IWidgetDefaultProps {
  pageConfig: IPageConfig;
  allWidgets: IWidget[],
  selectedWidgetId?: string | null | undefined;
  gridContainerRender?: (props: IGirdProps) => React.ReactNode;
  onWidgetSelect?: (id: string, type: string, settings: Settings) => void;
  onWidgetsUpdate?: (widgets: IWidget[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: IPageConfig) => void;
  onTabsInfoChange?: (id: string, activeTab: string, height: number) => void;
}

export interface ITableWidgetProps extends IWidgetDefaultProps {}

export interface ILineWidgetProps extends IWidgetDefaultProps {}

export interface IBarWidgetProps extends IWidgetDefaultProps {}

export interface IPieWidgetProps extends IWidgetDefaultProps {}

export interface IComplexWidgetProps extends IWidgetDefaultProps {}

export interface ITextWidgetProps extends IWidgetDefaultProps {}

export type ShowType = '1' | '2' | '3';

export type LegendType = 'top' | 'right' | 'bottom' | 'left';
