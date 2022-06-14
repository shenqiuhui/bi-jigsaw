import { ConfigProvider } from 'antd';

interface ThemeWrapperProps {
  theme: string;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = (props) => {
  const { theme, children } = props;

  return (
    <ConfigProvider prefixCls={theme}>
      {children}
    </ConfigProvider>
  );
}

export default ThemeWrapper
