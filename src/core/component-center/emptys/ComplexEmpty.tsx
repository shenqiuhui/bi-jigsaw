import classNames from 'classnames';
import lightEmpty from '@/assets/images/light-theme-complex-empty.png';
import darkEmpty from '@/assets/images/dark-theme-complex-empty.png';
import { EmptyProps } from './type';

import './index.less';

const ComplexEmpty: React.FC<EmptyProps> = (props) => {
  const { theme = 'light' } = props;

  return (
    <div className="empty-container empty-container-complex">
      <img
        src={theme === 'light' ? lightEmpty : darkEmpty}
        alt="组合图"
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

export default ComplexEmpty;
