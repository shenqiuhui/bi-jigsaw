import Board from '@/pages/Editor/components/Board';
import { IRenderEngine } from '@/types';

const renderEngine = (props: IRenderEngine) => {
  return (
    <Board {...props} />
  );
}

export default renderEngine;
