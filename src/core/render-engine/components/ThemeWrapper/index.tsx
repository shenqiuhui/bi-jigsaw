import { ConfigProvider } from 'antd';

interface ThemeWrapperProps {
  theme: string;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = (props) => {
  const { theme, children } = props;
  console.log('%c 🍈 theme: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', theme);

  return (
    <ConfigProvider prefixCls={theme}>
      {children}
    </ConfigProvider>
  );
}

export default ThemeWrapper
