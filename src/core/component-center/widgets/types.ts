import { WidgetDefaultProps, PageConfigType, WidgetType, SettingType, GirdProps, WidgetSizeType } from '@/core/render-engine';
import { RegisterBaseType } from '@/core/register';

export interface TabsWidgetProps extends WidgetDefaultProps {
  pageConfig: PageConfigType;
  allWidgets: WidgetType[],
  selectedWidgetId?: string | null | undefined;
  gridContainerRender?: (props: GirdProps) => React.ReactNode;
  onWidgetSelect?: (id: string, type: string, settings: SettingType) => void;
  onWidgetsUpdate?: (widgets: WidgetType[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: PageConfigType) => void;
  onTabsInfoChange?: (id: string, activeTab: string, height: number) => void;
}

export interface TableWidgetProps extends WidgetDefaultProps {}

export interface LineWidgetProps extends WidgetDefaultProps {}

export interface BarWidgetProps extends WidgetDefaultProps {}

export interface PieWidgetProps extends WidgetDefaultProps {}

export interface ComplexWidgetProps extends WidgetDefaultProps {}

export interface TextWidgetProps extends WidgetDefaultProps {}

export type ShowType = '1' | '2' | '3';

export type LegendType = 'top' | 'right' | 'bottom' | 'left';

export type NewWidgetType = Omit<WidgetType, 'id' | 'coordinate'>;

export interface WidgetCommonType extends RegisterBaseType, WidgetSizeType {
  showHeader: boolean;
  useLoading: boolean;
  showInFilter: boolean;
}
