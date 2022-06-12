import widgetStore from './widget-store';
import Board from './components/Board';
import { RenderEngineType } from './types';

export const COLS = 12;
export const ROW_HEIGHT= 10;

export { widgetStore };
export { default as AuthHOC } from './components/AuthHOC';
export * from './types';

export const renderEngine = (props: RenderEngineType) => {
  return (
    <Board {...props} />
  );
}
