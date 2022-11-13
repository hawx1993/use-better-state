import { SetStateAction, useState, Dispatch, useEffect } from 'react';
import { nanoid } from 'nanoid';

const globalState = new Map();
const currentState = new Map();
const globalStore = new Map();
const incomingGlobalState = new Map();
const incomingCurrentState = new Map();

enum STORE_TYPE {
  GLOBAL_STATE = 'global_state',
  CURRENT_STATE = 'current_state',
}

const updateCurrentStoreValue = <K, ValueType>(
  key: K,
  current,
  value: ValueType,
) => {
  currentState.set(key, {
    value: {
      ...current.value,
      ...value,
    },
    updaters: current.updaters,
  });
};
const updateGlobalStoreValue = <K, ValueType>(
  key: K,
  current,
  value: ValueType,
) => {
  globalState.set(key, {
    value: {
      ...current.value,
      ...value,
    },
    updaters: current.updaters,
  });
};
const setCurrentStateValue = <K, ValueType>(key, defaultValue?: ValueType) => {
  if (!currentState.has(key)) {
    currentState.set(key, {
      value: defaultValue,
      updaters: new Set<Dispatch<SetStateAction<K>>>(),
    });
  }
};
const setGlobalStateValue = <K, ValueType>(key, defaultValue?: ValueType) => {
  if (!globalState.has(key)) {
    globalState.set(key, {
      value: defaultValue,
      updaters: new Set<Dispatch<SetStateAction<K>>>(),
    });
  }
};
const setStateValue = <K, ValueType>(
  key: K,
  type: STORE_TYPE,
  defaultValue?: ValueType,
) => {
  if (type === STORE_TYPE.CURRENT_STATE) {
    setCurrentStateValue(key, defaultValue);
  } else {
    setGlobalStateValue(key, defaultValue);
  }
};
const getStoreValue = <K, ValueType>(
  key: K,
  type: STORE_TYPE,
  defaultValue?: ValueType,
) => {
  setStateValue(key, type, defaultValue);
  if (type === STORE_TYPE.CURRENT_STATE) {
    return currentState.get(key);
  }
  return globalState.get(key);
};
const emitUpdate = <K, ValueType = any>(key: K, type: STORE_TYPE) => {
  const current = getStoreValue<K, ValueType>(key, type);
  current.updaters.forEach((listener: Dispatch<SetStateAction<K>>) => {
    listener(current.value);
  });
};
const updatedStateValue = <K, ValueType>(
  key: K,
  value: ValueType,
  type: STORE_TYPE,
) => {
  const current = getStoreValue(key, type);
  if (type === STORE_TYPE.CURRENT_STATE) {
    updateCurrentStoreValue(key, current, value);
  } else {
    updateGlobalStoreValue(key, current, value);
  }
  current.value = value;
};
const setDefaultValue = <K, ValueType>(
  key: K,
  type: STORE_TYPE,
  value?: ValueType,
) => {
  const current = getStoreValue(key, type);
  if (current.value === undefined && value !== undefined) {
    updatedStateValue(key, value, type);
  }
};
const cleanStore = (store, key) => {
  try {
    console.info(`cleaning ${key} currentStore...`, store);
    const success = store.delete(key);
    success
      ? console.info(`cleaning ${key} store done`)
      : console.warn('clean failed');
  } catch (error) {
    console.error('cleaning ${key} store failed!', error.message);
  }
};
const useCurrentState = <State>(initialState?: State) => {
  const key = useState(() => nanoid())[0];
  globalStore.set(STORE_TYPE.CURRENT_STATE, key);
  setDefaultValue(key, STORE_TYPE.CURRENT_STATE, initialState);
  const current = getStoreValue(key, STORE_TYPE.CURRENT_STATE, initialState);
  const state = useState(current.value);
  const listeners = {} as any;
  currentState.forEach((value, curKey: typeof key) => {
    listeners[curKey] = new Set();
  });
  useEffect(() => {
    const cleanup = () => {
      incomingCurrentState.delete(key);
      cleanStore(currentState, key);
    };
    return cleanup;
  }, []);
  current.updaters.add(state[1]);
  return current?.value || {};
};
/**
 * 更新当前view的state，view 和 viewModel 适用
 * 参数：updateCurrentState(value)
 */
const updateCurrentState = <ValueType = any>(incomingValue: ValueType) => {
  const key = globalStore.get(STORE_TYPE.CURRENT_STATE);
  updatedStateValue<typeof key, ValueType>(
    key,
    incomingValue,
    STORE_TYPE.CURRENT_STATE,
  );
  emitUpdate<typeof key, ValueType>(key, STORE_TYPE.CURRENT_STATE);
};

/**
 * 通过key更新全局view 对应的state，view 和 viewModel 适用
 * 参数：updateGlobalStateByKey(key, value)
 */
const updateGlobalStateByKey = <K, ValueType = any>(
  key: K,
  incomingValue: ValueType,
) => {
  updatedStateValue<K, ValueType>(key, incomingValue, STORE_TYPE.GLOBAL_STATE);
  emitUpdate<K, ValueType>(key, STORE_TYPE.GLOBAL_STATE);
};
/**
 * hooks，获取全局 view 对应的state，仅view 适用
 * 参数：useGlobalState(key, initialState?)
 */
const useGlobalState = <K, State>(key: K, initialState?: State) => {
  setDefaultValue(key, STORE_TYPE.GLOBAL_STATE, initialState);
  const current = getStoreValue(key, STORE_TYPE.GLOBAL_STATE, initialState);
  const state = useState(current.value);
  const listeners = {} as any;
  globalState.forEach((value, key: K) => {
    listeners[key] = new Set();
  });
  useEffect(() => {
    const cleanup = () => {
      incomingGlobalState.delete(key);
    };
    return cleanup;
  }, []);
  current.updaters.add(state[1]);
  return current?.value || {};
};

export {
  useCurrentState,
  updateCurrentState,
  updateGlobalStateByKey,
  useGlobalState,
};
