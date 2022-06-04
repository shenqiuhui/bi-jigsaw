import Board from './components/Board';
import { IRenderEngine } from './types';

export const renderEngine = (props: IRenderEngine) => {
  return (
    <Board {...props} />
  );
}

export { default as AuthHOC } from './components/AuthHOC';
