import { useCallback, useDebugValue, useLayoutEffect, useState } from 'react';

/** Функция, которая вернёт новое значение для состояния */
export type NewStateSetter<T> = (prevState: T) => T;

/** Новое значение для состояния, либо же функция, котороя вернёт новое значение */
export type NewState<T> = T | NewStateSetter<T>;

/** Функция для обновления состояниями */
export type StateSetter<T> = (newState: NewState<T>) => void;

/** Проверяет изменено ли состояние с помощью функции */
export const isNewStateSetter = <T>(newState: NewState<T>): newState is NewStateSetter<T> => {
  return typeof newState === 'function';
};

const LOCAL_STORAGE_CHANGE_EVENT = 'local-storage-change';

interface StorageChangeEventDetail {
  key: string;
  newValue: unknown;
}

const parseStorageValue = <T>(value: string | null): T | undefined => {
  try {
    return value !== null ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Работа с данными с хранилища по ключу.
 * Реагирует на изменения в других компонентах и вкладках браузера
 *
 * @remarks
 * Для удаления данных следует изменить значение на `undefined`
 *
 * @param key - Ключ по которому будет происходить загрузка / запись
 * @param fallbackValue - Значение, которое будет возвращено, если ключа нет в хранилище
 * @returns Текущее значение, функция для его изменения, а также происходит ли всё ещё загрузка
 */
const useStorage = <T>(
  key: string,
  fallbackValue?: T,
): readonly [T | undefined, StateSetter<T | undefined>, boolean] => {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    let isMounted = true;

    const loadValue = () => {
      if (typeof window === 'undefined') return;

      const rawValue = localStorage.getItem(key);
      const initialValue = parseStorageValue<T>(rawValue);

      if (isMounted) {
        setValue(initialValue);
        setIsLoading(false);
      }
    };

    loadValue();

    const handleStorageChange = (event: StorageEvent | CustomEvent<StorageChangeEventDetail>) => {
      if (!isMounted) return;

      if (event instanceof StorageEvent) {
        if (event.key === key && event.storageArea === localStorage) {
          setValue(parseStorageValue<T>(event.newValue));
        }
      } else if (event instanceof CustomEvent && event.type === LOCAL_STORAGE_CHANGE_EVENT) {
        if (event.detail?.key === key) {
          setValue(event.detail.newValue as T | undefined);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleStorageChange as EventListener);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleStorageChange as EventListener);
    };
  }, [key]);

  const setter = useCallback<StateSetter<T | undefined>>((newState) => {
    setValue((currentValue) => {
      const computedValue = isNewStateSetter(newState) ? newState(currentValue) : newState;

      if (typeof window !== 'undefined') {
        if (computedValue === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(computedValue));
        }

        window.dispatchEvent(
          new CustomEvent<StorageChangeEventDetail>(LOCAL_STORAGE_CHANGE_EVENT, {
            detail: { key, newValue: computedValue },
          }),
        );
      }

      return computedValue;
    });
  }, [key]);

  const finalValue = value === undefined ? fallbackValue : value;
  useDebugValue(finalValue);
  return [finalValue, setter, isLoading] as const;
};

export default useStorage;
