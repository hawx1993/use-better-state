# use-better-state

better react useState, and simplify state writing, provide global state management, and provide immer fine-grained updates.


<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/use-better-state" />
  <img src="https://img.shields.io/github/stars/hawx1993/use-better-state" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/use-better-state" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/use-better-state" />
</p>

with `use-better-state`, you don't need to 

```ts
const [name, setName] = useState();
const [user, setUser] = useState();
const ....
```
just do :

```ts
const {name = '' ,user = 0, updateCurrentState} = useCurrentState();

updateCurrentState({
  name: 'nilu', age: 1
})
```
### Quick Start

```bash
$ yarn add use-better-state
```
## API
### `useCurrentState(initState)`

Update the state of the current view, equals to useState updater.

value：state value to update

you can destruct `updateImmerState` and `updateCurrentState` from useCurrentState

>Examples

```tsx
import {  useCurrentState } from 'use-better-state';,

export const Parent = () => {
  const { count = 0, name = 'init name', updateCurrentState , updateImmerState} = useCurrentState({
     user: {
        name: 'nilu',
        age: 0,
      },
  });
  const increment = () =>
    updateCurrentState({ count: count + 1, name: 'mike' });

  const updateUserInfo = () => {
    updateImmerState(draft => {
      draft.user.age = 11;
    });
  };
  // log: user: {name: 'nilu', age: 11}
  return (
    <div>
      <button onClick={increment}>click: {count}</button>
       <button onClick={updateUserInfo}>updateUserInfo</button>
      <p>{name}</p>
    </div>
  );
};
```



### useGlobalState(globalKey, initState)

Respond to updates from updateGlobalState across components to automatically render the current component

you can destruct `updateGlobalImmerState` and `updateGlobalState` from useGlobalState

```tsx
// Parent.tsx
export const Parent = () => {
  const { count, updateGlobalState, updateGlobalImmerState } = useGlobalState(
    GLOBAL_KEYS.GLOBAL_COUNT,
    { count: 0, userInfo: { name: 'apple', age: 1 } }
  );
  const increment = () => updateGlobalState({ count: count + 1 });

  const updateGlobalUser = () => {
    updateGlobalImmerState(draft => {
      draft.userInfo.age = 21;
    });
  };
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
    const { count, userInfo } = useGlobalState(GLOBAL_KEYS.GLOBAL_COUNT);
    //log userInfo {name: 'apple', age: 21}
    return (
      <>
        <div>Child component</div>
        <p>count: {count}</p>
        <p>{userInfo}</p>
      </>
    );
  }
);
```
