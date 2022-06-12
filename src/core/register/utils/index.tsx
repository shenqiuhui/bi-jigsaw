import React from 'react';
import { values } from 'lodash';
import { ComponentMapType, ConfigMapType, FieldSetType, PathOptionsType, RegisterOptionsType } from '../types';

const componentMap: ComponentMapType = {};
const configMap: ConfigMapType = {};

// 删除项
const deleteInfo = (map: ComponentMapType | ConfigMapType, namespace?: string, type?: string) => {
  if (namespace && type) {
    delete map[namespace][type];
  }

  if (namespace && !type) {
    delete map[namespace];
  }

  if (!namespace && !type) {
    for (let key in map) {
      delete map[key];
    }
  }
}

// 生成枚举值列表
const generateEnumList = <T extends {}>(
  map: ComponentMapType,
  namespace: string,
  fieldSet: FieldSetType
): T[] => {
  return values(map[namespace])?.map(({type, name}) => {
    return {
      [fieldSet.fieldKey]: type,
      [fieldSet.fieldName]: name
    } as T;
  });
}

// 是否经存在组件
const hasComponent = (namespace: string, type: string) => {
  return !!componentMap?.[namespace]?.[type];
}

// 是否存在配置
const hasConfig = (namespace: string, type: string) => {
  return !!configMap?.[namespace]?.[type];
}

// 注册组件
const componentRegister = <T, K extends {}>(
  Component: React.ComponentType<K>,
  pathOptions: PathOptionsType,
  others: T
) => {
  const { namespace, type, name } = pathOptions;

  if (!(namespace && type && name)) {
    throw new Error(`"namespace", "type", "name" is require.`);
  }

  if (React.isValidElement(Component)) {
    throw new Error('The "Component" argument must be an React Component.');
  }

  const componentInfo = {
    type,
    name,
    component: (props: K) => <Component {...props} />,
    ...others
  };

  if (componentMap[namespace]) {
    componentMap[namespace][type] = componentInfo;
  } else {
    componentMap[namespace] = {
      [type]: componentInfo
    };
  }

  return `${namespace}/${type}`;
}

// 注册配置
const configRegister = <T extends {}>(pathOptions: PathOptionsType, config: T) => {
  const { namespace, type, name } = pathOptions;

  if (!(namespace && type && name)) {
    throw new Error(`"namespace", "type", "name" is require.`);
  }

  const configInfo = {
    type,
    name,
    ...config
  };

  if (configMap[namespace]) {
    configMap[namespace][type] = configInfo;
  } else {
    configMap[namespace] = {
      [type]: configInfo
    };
  }

  return `${namespace}/${type}`;
}

// 注销组件
const componentDestroy = (namespace?: string, type?: string) => {
  return deleteInfo(componentMap, namespace, type);
}

// 删除配置
const configDelete = (namespace?: string, type?: string) => {
  return deleteInfo(configMap, namespace, type);
}
// 获取组件
const getComponents = (namespace: string) => {
  return componentMap[namespace];
}

// 获取配置
const getConfig = (namespace: string) => {
  return configMap[namespace];
}

// 根据组件生成枚举值列表
const generateEnumListByComponent = <T extends {}>(namespace: string, fieldSet: FieldSetType = {
  fieldKey: 'value',
  fieldName: 'label'
}): T[] => {
  return generateEnumList<T>(componentMap, namespace, fieldSet);
}

// 根据配置生成枚举值列表
const generateEnumListByConfig = <T extends {}>(namespace: string, fieldSet: FieldSetType = {
  fieldKey: 'value',
  fieldName: 'label'
}): T[] => {
  return generateEnumList<T>(configMap, namespace, fieldSet);
}

export const init = (options: RegisterOptionsType) => {
  options?.config?.forEach((register) => register?.(Register));
  options?.component?.forEach((register) => register?.(Register));

  return {
    config: configMap,
    component: componentMap
  };
}

const Register = {
  hasComponent,
  hasConfig,
  componentRegister,
  configRegister,
  componentDestroy,
  configDelete,
  getComponents,
  getConfig,
  generateEnumListByComponent,
  generateEnumListByConfig,
  init
};

export default Register;
