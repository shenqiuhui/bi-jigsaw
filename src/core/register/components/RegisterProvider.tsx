import React, { createContext } from 'react';
import { RegisterResultType } from '../types';

interface RegisterProviderProps {
  value: RegisterResultType;
}

export const context = createContext<RegisterResultType>({
  config: {},
  component: {}
});

const { Provider } = context;

const RegisterProvider: React.FC<RegisterProviderProps> = (props) => {
  const { value, children } = props;

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
}

export default RegisterProvider;
