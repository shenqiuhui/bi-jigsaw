import { ConfigProvider } from 'antd';
import * as echarts from 'echarts';
import { lightTheme, darkTheme } from './config';

interface ThemeWrapperProps {
  theme: string;
}

echarts.registerTheme(lightTheme.themeName, lightTheme.theme);
echarts.registerTheme(darkTheme.themeName, darkTheme.theme);

const ThemeWrapper: React.FC<ThemeWrapperProps> = (props) => {
  const { theme = 'light', children } = props;

  return (
    <ConfigProvider prefixCls={theme}>
      {children}
    </ConfigProvider>
  );
}

export default ThemeWrapper
