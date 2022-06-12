import empty from '@/assets/images/table-empty.png';

import './index.less';

const TableEmpty = () => (
  <div className="empty-container empty-container-table">
    <img src={empty} alt="表格" />
    <div className="empty-tips">
      当前图表暂无数据
    </div>
  </div>
);

export default TableEmpty;
