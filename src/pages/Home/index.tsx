import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import './index.less';

const Home = () => {
  const history = useHistory();

  const handlePreviewJump = () => {
    history.push('/preview/20398/1');
  }

  const handleEditJump = () => {
    history.push('/editor/20398/1');
  }

  return (
    <div className="home-container">
      <Button type="link" onClick={handlePreviewJump}>
        预览 ~/preview/:spaceId/:pageId
      </Button>
      <br />
      <Button type="link" onClick={handleEditJump}>
        编辑器 ~/editor/:spaceId/:pageId
      </Button>
    </div>
  );
}

export default Home;
