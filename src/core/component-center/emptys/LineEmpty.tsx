import classNames from 'classnames';
import lightEmpty from '@/assets/images/line-empty-light.png';
import darkEmpty from '@/assets/images/line-empty-dark.png';
import { EmptyProps } from './type';

import './index.less';

const LineEmpty: React.FC<EmptyProps> = (props) => {
  const { theme = 'light' } = props;

  return (
    <div className="empty-container empty-container-line">
      <img
        src={theme === 'light' ? lightEmpty : darkEmpty}
        alt="折线图"
      />
      <div
        className={classNames({
          'empty-tips': true,
          'empty-tips-light': theme === 'light',
          'empty-tips-dark': theme === 'dark'
        })}
      >
        当前图表暂无数据
      </div>
    </div>
  );
}

export default LineEmpty;
