import empty from '@/assets/images/bar-empty.png';

import './index.less';

const BarEmpty = () => (
  <div className="empty-container empty-container-bar">
    <img src={empty} alt="柱状图" />
    <div className="empty-tips">
      当前图表暂无数据
    </div>
  </div>
);

export default BarEmpty;
