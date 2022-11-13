# use-better-state

better react useState, and simplify state writing, provide global state management, and provide immer fine-grained updates.



<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/use-better-state" />
  <img src="https://img.shields.io/github/stars/hawx1993/use-better-state" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/use-better-state" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/use-better-state" />
</p>


### useCurrentState & updateCurrentState

Update the state of the current view, equals to useState updater.

value：state value to update

>Examples

```tsx
import { updateCurrentState , useCurrentState } from 'use-better-state';,
import { GLOBAL_KEYS } from './types';
export const Parent = () => {
  const { count = 0, name = 'init name' } = useCurrentState();
  const increment = () =>
    updateCurrentState({ count: count + 1, name: 'mike' });
  return (
    <div>
      <button onClick={increment}>click: {count}</button>
      <p>{name}</p>
    </div>
  );
};
```



### useGlobalState & updateGlobalStateByKey

Respond to updates from updateGlobalStateByKey across components to automatically render the current component

```tsx
// Parent.tsx
import { GLOBAL_KEYS } from './types';
export const Parent = () => {
  const { count  } = useGlobalState(GLOBAL_KEYS.GLOBAL_COUNT, { count: 0 });
  const increment = () =>
    updateGlobalStateByKey('GLOBAL_COUNT', { count: count + 1 });
  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <Child onClick={onClick} />
    </div>
  );
};
```

```tsx
// Child.tsx
export const Child = memo(
  (props:  onClick: (value: any) => void }) => {
    const { name, onClick } = props;
    const { count } = useGlobalState(GLOBAL_KEYS.GLOBAL_COUNT);
    return (
      <>
        <div>Child component</div>
        <p>count: {count}</p>
      </>
    );
  }
);
```
