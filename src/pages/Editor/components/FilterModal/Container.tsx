import React, { memo } from 'react';
import { isNil, isFunction } from 'lodash';
import classNames from 'classnames';

import './index.less';

interface IContainer {
  title?: string | React.ReactNode;
  width?: number | string;
  children?: React.ReactNode;
  border?: 'left' | 'right' | 'both' | 'none';
  renderOperator?: () => React.ReactNode;
}

const borderClassName = {
  'both': 'border-both',
  'left': 'border-left',
  'right': 'border-right',
  'none': ''
};

const Container: React.FC<IContainer> = memo((props) => {
  const { title, width, border = 'both', children, renderOperator } = props;

  return (
    <div
      className={classNames({
        'container-up-down': true,
        [borderClassName[border]]: true
      })}
      style={ width ? { width } : {}}
    >
      <div className="title-container">
        {!isNil(title) && (
          <h1>{title}</h1>
        )}
        {renderOperator && isFunction(renderOperator) && (
          <div>{renderOperator()}</div>
        )}
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
});

export default Container;
