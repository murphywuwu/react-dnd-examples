# react-dnd-examples
learn react-dnd by write examples

## Items and Types
types是很有用的，当你的app逐渐发展，你可能想需要更多的东西是可拖曳的，但是你并不想要所有存在的放置目标都可以和对新的拖曳对象是兼容的。因此**types让你指定那一对拖动源和放置目标是兼容的。** 你可能有可枚举的类型变量在你的应用里，就像你可能也有可枚举的redux action类型。

## Monitors
拖放本质上是有状态的。monitors提供拖放状态数据，让你有机会更新组件的props，以响应拖放状态更改

+ `getInitialSourceClientOffset()`: 返回当前拖动操作开始时拖动源组件的根DOM节点的{ x, y }客户端偏移量。如果没有拖动项目，则返回null
截图为，拖动一小段距离后，所量的大概的距离。可以知道，打印的也是initalOffset的值，因此可以知道，该值是相对于视口定位的。具体代码[CustomDragLayer](./src/examples-hook/02-drag-around/custom-drag-layer/CustomDragLayer.jsx)


![image](https://user-images.githubusercontent.com/12481194/59901284-50b52a00-942d-11e9-8d16-d7b2e5efdf2d.png)

![image](https://user-images.githubusercontent.com/12481194/59901327-78a48d80-942d-11e9-852a-343a46873af4.png)

+ `getSourceClientOffset`: 返回拖动源组件的根DOM节点的预计`{ x, y }`偏移量，基于其在当前拖动操作开始时的位置以及移动差异。如果没有拖动项目，则返回null。
原理同上：该值的计算也是基于拖动元素具体视口的位置计算的。

![image](https://user-images.githubusercontent.com/12481194/59901847-26fd0280-942f-11e9-82a2-87d911d6f8a3.png)

![image](https://user-images.githubusercontent.com/12481194/59901905-48f68500-942f-11e9-8396-56cf8b2ee91c.png)

+ `getDifferenceFromInitialOffset`: 返回`{x, y}`当前拖动操作开始时指针记录的最后客户端偏移量与拖动刚开始的客户端偏移量之间的差异

```
// x, y的值相当于，拖动元素的移动距离
const { x, y } = getDifferenceFromInitialOffset();
const initialOffset = getInitialSourceClientOffset();
const currentOffset = getSourceClientOffset();

currentOffset.x - initialOffset.x == x;
currentOffset.y - initialOffset.y == y;
```

+ `isOver({ shallow: true })`: 用于检测悬停是仅发生在当前目标上还是嵌套上

+ `getClientOffset()`: 在拖动操作进行时，返回指针(鼠标在拖曳块上的位置)的最后记录的`{x, y}`客户端偏移量。如果没有拖动项目，则返回null

## Top-Level API

#### useDrag

```
import { useDrag } from 'react-dnd'

function DraggableComponent(props) {
  const [collectedProps, drag] = useDrag({
    item: { id, type },
    options: {
      dropEffect: props.showCopyIcon ? 'copy' : 'move',
    },
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

#### DragPreviewImage
用于将HTML Image元素呈现为断开连接的拖动预览的组件

```
const BoxWithImage = () => {
    const [{ opacity }, drag, preview] = useDrag({
        item: { type: ItemTypes.BOX },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
        }),
    });
    return (<>
			<DragPreviewImage connect={preview} src={boxImage}/>
			<div ref={drag} style={{ ...style, opacity }}>
				Drag me to see an image
			</div>
		</>);
};

```

## Backends

+ `getEmptyImage()`: 一个返回透明空图像的元素。集合`connectDragPreview`或者`const [, preview] = useDrag({...})`使用。custom drag preview在IE中不起作用

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

### 02-drag-around

#### custom-drag-layer

```
function getStyles(left, top, isDragging) {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        <!-- 不考虑IE -->
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        // opacity: isDragging ? 0 : 1,
        // height: isDragging ? 0 : '',
    };
}

const DraggableBox = props => {
    const { id, title, left, top } = props;
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.BOX, id, left, top, title },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    useEffect(() => {
        <!-- 注释掉previe相关代码 -->
        // preview(getEmptyImage(), { 
          // IE fallback: specify that we'd rather screenshot the node
          // when it already knows it's being dragged so we can hide it with CSS.
          // captureDraggingState: true 
        // });
    }, []);
    return (<div ref={drag} style={getStyles(left, top, isDragging)}>
			<Box title={title}/>
		</div>);
};
```

```
import React from 'react';
import { useDragLayer } from 'react-dnd';
import ItemTypes from './ItemTypes';
import BoxDragPreview from './BoxDragPreview';
import snapToGrid from './snapToGrid';
const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};
function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = currentOffset;

    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);

        x += initialOffset.x;
        y += initialOffset.y;
    }
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
}
const CustomDragLayer = props => {
    const { itemType, isDragging, item, initialOffset, currentOffset, } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    function renderItem() {
        switch (itemType) {
            case ItemTypes.BOX:
                return <BoxDragPreview title={item.title}/>;
            default:
                return null;
        }
    }
    if (!isDragging) {
        return null;
    }
    
    return (<div style={layerStyles}>
      <!-- 去除这段代码，仅仅renderItem() -->
			<!-- <div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}> -->
				{renderItem()}
			<!-- </div> -->
		</div>);
};
```
**work withought preview-getEmptyImage**
![image](https://user-images.githubusercontent.com/12481194/59906199-b1972f00-943a-11e9-8fe9-b5f95fdf6a7b.png)

**work with preview-getEmptyImage**
![image](https://user-images.githubusercontent.com/12481194/59907038-b78e0f80-943c-11e9-835d-e73397e848e5.png)

**work with preview-getEmptyImage && 根据拖动元素动态计算Drag Layer位置**

```
function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = currentOffset;

    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);

        x += initialOffset.x;
        y += initialOffset.y;
    }
    // 动态计算自定义拖动层的位置
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
// 获取拖动源的初始坐标和移动坐标数据
const { itemType, isDragging, item, initialOffset, currentOffset, } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
}));
```
![image](https://user-images.githubusercontent.com/12481194/59907482-be695200-943d-11e9-9bd1-7bd9e3f727bf.png)

**work withought preview-getEmptyImage && 根据拖动元素动态计算Drag Layer位置**
![image](https://user-images.githubusercontent.com/12481194/59908045-0ccb2080-943f-11e9-96cc-36858536e82a.png)
