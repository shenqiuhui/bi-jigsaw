import { useContext } from 'react';
import Register from '../utils';
import { context } from '../components/RegisterProvider';
import { RegisterResultType } from '../types';

const { getComponents, hasComponent, componentDestroy, generateEnumListByComponent } = Register;

const useComponent = <T extends {}>(namespace?: string) => {
  const { component = {} } = useContext<RegisterResultType>(context);

  return [
    namespace ? component?.[namespace] : component as { [key: string]: T },
    { getComponents, hasComponent, componentDestroy, generateEnumListByComponent }
  ];
}

export default useComponent;
