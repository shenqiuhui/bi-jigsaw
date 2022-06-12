import empty from '@/assets/images/complex-empty.png';

import './index.less';

const ComplexEmpty = () => (
  <div className="empty-container empty-container-complex">
    <img src={empty} alt="组合图" />
    <div className="empty-tips">
      当前图表暂无数据
    </div>
  </div>
);

export default ComplexEmpty;
