import lightEmpty from '@/assets/images/light-theme-text-empty.png';
import darkEmpty from '@/assets/images/dark-theme-text-empty.png';
import { EmptyProps } from './type';

import './index.less';

const TextEmpty: React.FC<EmptyProps> = (props) => {
  const { theme = 'light' } = props;

  return (
    <div className="empty-container empty-container-text">
      <img
        src={theme === 'light' ? lightEmpty : darkEmpty}
        alt="文本"
      />
    </div>
  );
}

export default TextEmpty;
