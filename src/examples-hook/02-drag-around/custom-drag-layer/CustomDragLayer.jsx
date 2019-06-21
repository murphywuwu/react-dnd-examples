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
    // console.log('currentOffset', x, y);
    // console.log('initialOffset', initialOffset.x, initialOffset.y);
    // console.log('currentOffset - initialOffset', x- initialOffset.x,  y - initialOffset.y);
    if (isSnapToGrid) {
        // 移动的距离
        x -= initialOffset.x;
        y -= initialOffset.y;
        // console.log(x, y);
        [x, y] = snapToGrid(x, y);
        // console.log('snapToGrid', x, y)
        // 获取新坐标
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
    // 通过useDragLayer获取，拖动状态
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
      <div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}>
				{renderItem()}
		  </div> 
		</div>);
};
export default CustomDragLayer;
