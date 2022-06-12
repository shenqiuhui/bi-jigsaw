import { useContext } from 'react';
import Register from '../utils';
import { context } from '../components/RegisterProvider';
import { RegisterResultType } from '../types';

const { getConfig, hasConfig, configDelete, generateEnumListByConfig } = Register;

const useConfig = <T extends {}>(namespace?: string) => {
  const { config = {} } = useContext<RegisterResultType>(context);

  return [
    namespace ? config?.[namespace] : config as { [key: string]: T },
    { getConfig, hasConfig, configDelete, generateEnumListByConfig }
  ];
}

export default useConfig;
