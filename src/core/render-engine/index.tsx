import Board from './components/Board';
import { IRenderEngine } from './types';

export const COLS = 12;
export const ROW_HEIGHT= 10;

export const renderEngine = (props: IRenderEngine) => {
  return (
    <Board {...props} />
  );
}

export { default as AuthHOC } from './components/AuthHOC';
