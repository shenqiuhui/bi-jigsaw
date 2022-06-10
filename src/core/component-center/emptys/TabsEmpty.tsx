import empty from '@/assets/images/tabs-empty.png';

import './index.less';

const TabsEmpty = () => {
  return (
    <div className="empty-container empty-container-tabs">
      <img src={empty} alt="标签页" />
      <div className="empty-tips">
        当前区域暂无图表
      </div>
    </div>
  );
}

export default TabsEmpty;
