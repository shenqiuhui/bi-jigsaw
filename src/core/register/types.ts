export interface RegisterType {
  hasComponent: (namespace: string, type: string) => boolean;
  hasConfig: (namespace: string, type: string) => boolean;
  componentRegister: <T, K extends {}>(Component: React.ComponentType<K>, pathOptions: PathOptionsType, others: T) => string;
  configRegister: <T extends {}>(pathOptions: PathOptionsType, config: T) => string;
}

export interface ComponentMapType<T = any> {
  [key: string]: T;
}

export interface ConfigMapType<T = any> {
  [key: string]: T;
}

export interface FieldSetType {
  fieldKey: string;
  fieldName: string;
}

export interface PathOptionsType {
  namespace: string;
  type: string;
  name: string;
  isComponent?: boolean;
}

export interface RegisterBaseType {
  type?: string;
  name?: string;
  component?: Function;
}

export interface WidgetButtonType {
  type: string;
  name: string;
}

export interface RegisterResultType {
  config: ConfigMapType;
  component: ComponentMapType;
}

type ConfigRegisterType = (register: RegisterType) => void;
type ComponentRegisterType = (register: RegisterType) => void;

export interface RegisterOptionsType {
  config: ConfigRegisterType[];
  component: ComponentRegisterType[];
}
