# react-dnd-examples
learn react-dnd by write examples

## Items and Types
types是很有用的，当你的app逐渐发展，你可能想需要更多的东西是可拖曳的，但是你并不想要所有存在的放置目标都可以和对新的拖曳对象是兼容的。因此**types让你指定那一对拖动源和放置目标是兼容的。** 你可能有可枚举的类型变量在你的应用里，就像你可能也有可枚举的redux action类型。

## Monitors
拖放本质上是有状态的。monitors提供拖放状态数据，让你有机会更新组件的props，以响应拖放状态更改

## Top-Level API

#### useDrag

```
import { useDrag } from 'react-dnd'

function DraggableComponent(props) {
  const [collectedProps, drag] = useDrag({
    item: { id, type },
    canDrag: (monitor) => {  },
    begin: (monitor) => {  },
    isDragging: (monitor) => {  },
    end: (item) => {  },
    collect: monitor => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })
  return <div ref={drag}>...</div>
}
```
#### useDrop

```
import { useDrop } from 'react-dnd'

function myDropTarget(props) {
  const [collectedProps, drop] = useDrop({
    accept,
    canDrop: (item, monitor) => {}
    hover: (item, monitor) => {}
    drop: (item, monitor) => {}
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return <div ref={drop}>Drop Target</div>
}
```



### 00-chessboard
```
// 初始化坐标
let knightPosition = [1, 7];
let observers = [];

// 触发重渲染
function emitChange() {
    // 初始化象棋坐标以及每次更新象棋坐标：emitChange都会调用两次
    console.log('emitChange'); 
    observers.forEach(o => o && o(knightPosition));
}
// 每当重渲染，先清理之前的观察者，再添加新的观察者
export function observe(o) {
    observers.push(o);

    // 触发重渲染
    emitChange();
    
    return () => {
        observers = observers.filter(t => t !== o);
    };
}

// 接收新坐标-更改坐标-触发重渲染
export function moveKnight(toX, toY) {
    knightPosition = [toX, toY];
    emitChange();
}
```
Game.jsx提供初始化坐标和接收外部数据的`moveKnight`方法用来更新坐标。同时，当坐标更改时，调用观察者，更改外部数据源`knightPos`。

![image](https://user-images.githubusercontent.com/12481194/59825382-7a574e00-9366-11e9-9c1e-22cbf70d2992.png)

```
export function canMoveKnight(toX, toY) {
    const [x, y] = knightPosition;
    const dx = toX - x;
    const dy = toY - y;
    return ((Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2));
}
```
如图，拖动元素可以放置的框：分两种情况

1. 横坐标上到拖动元素的位置有2个位置的绝对距离，纵坐标上到拖动元素的位置有1个位置的绝对距离
2. 横坐标上到拖动元素的位置有1个位置的绝对距离，纵坐标上到拖动元素的位置有2个位置的绝对距离

![image](https://user-images.githubusercontent.com/12481194/59816201-cc3faa00-934d-11e9-942a-3e359f64f5fb.png)
