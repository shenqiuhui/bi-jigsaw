import classNames from 'classnames';
import lightEmpty from '@/assets/images/light-theme-pie-empty.png';
import darkEmpty from '@/assets/images/dark-theme-pie-empty.png';
import { EmptyProps } from './type';

import './index.less';

const PieEmpty: React.FC<EmptyProps> = (props) => {
  const { theme = 'light' } = props;

  return (
    <div className="empty-container empty-container-pie">
      <img
        src={theme === 'light' ? lightEmpty : darkEmpty}
        alt="饼图"
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

export default PieEmpty;
