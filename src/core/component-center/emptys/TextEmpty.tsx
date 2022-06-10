import empty from '@/assets/images/text-empty.png';

import './index.less';

const TextEmpty = () => {
  return (
    <div className="empty-container empty-container-text">
      <img src={empty} alt="文本" />
    </div>
  );
}

export default TextEmpty;
