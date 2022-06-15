import classNames from 'classnames';
import lightEmpty from '@/assets/images/light-theme-bar-empty.png';
import darkEmpty from '@/assets/images/dark-theme-bar-empty.png';
import { EmptyProps } from './type';

import './index.less';

const BarEmpty: React.FC<EmptyProps> = (props) => {
  const { theme = 'light' } = props;

  return (
    <div className="empty-container empty-container-bar">
      <img
        src={theme === 'light' ? lightEmpty : darkEmpty}
        alt="柱状图"
      />
      <div
        className={classNames({
          'empty-tips': true,
          'light-theme-empty-tips': theme === 'light',
          'dark-theme-empty-tips': theme === 'dark'
        })}
      >
        当前图表暂无数据
      </div>
    </div>
  );
}

export default BarEmpty;
