import empty from '@/assets/images/line-empty.png';

import './index.less';

const LineEmpty = () => {
  return (
    <div className="empty-container empty-container-line">
      <img src={empty} alt="折线图" />
      <div className="empty-tips">
        当前图表暂无数据
      </div>
    </div>
  );
}

export default LineEmpty;
