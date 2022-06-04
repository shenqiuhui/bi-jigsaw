import { IRenderEngine } from '@/types';
import Board from './components/Board';

export const renderEngine = (props: IRenderEngine) => {
  return (
    <Board {...props} />
  );
}
