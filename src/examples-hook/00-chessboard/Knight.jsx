import React from 'react';
import { DragPreviewImage, useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';
import knightImage from './knightImage';
const knightStyle = {
    fontSize: 40,
    fontWeight: 'bold',
    cursor: 'move',
};
// 拖动元素
export const Knight = () => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.KNIGHT },

        // 指定collect回调函数：获取拖动元素的状态
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });
    return (<>
      {/* 用于将HTML Image元素呈现为断开连接的拖动预览的Component */}
			<DragPreviewImage connect={preview} src={knightImage}/>
      {/* ref={drag}，绑定拖动元素 */}
			<div ref={drag} style={{
        ...knightStyle,
        opacity: isDragging ? 0.5 : 1,
    }}>
				♘
			</div>
		</>);
};
