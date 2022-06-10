import empty from '@/assets/images/pie-empty.png';

import './index.less';

const PieEmpty = () => {
  return (
    <div className="empty-container empty-container-pie">
      <img src={empty} alt="饼图" />
      <div className="empty-tips">
        当前图表暂无数据
      </div>
    </div>
  );
}

export default PieEmpty;
