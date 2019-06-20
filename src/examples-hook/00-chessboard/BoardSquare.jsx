import React from 'react';
import { useDrop } from 'react-dnd';
import { Square } from './Square';
import { canMoveKnight, moveKnight } from './Game';
import ItemTypes from './ItemTypes';
import Overlay from './Overlay';

// 拖动目标
export const BoardSquare = ({ x, y, children, }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        // 指定接受的拖动元素
        accept: ItemTypes.KNIGHT,

        canDrop: () => canMoveKnight(x, y),
        drop: () => moveKnight(x, y),

        // 指定collect回调函数：获取拖动元素在指定拖动目标上的状态
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });
    // 第一排依次为01，03，05...07
    // 第二排依次为10，12，14...16
    // 依次类推
    const black = (x + y) % 2 === 1;
    
    // ref={drop}，绑定拖动目标
    return (<div ref={drop} style={{
        // overlay相对于单个square本身定位
        position: 'relative',
        width: '100%',
        height: '100%',
    }}>
			<Square black={black}>{children}</Square>
			{isOver && !canDrop && <Overlay color="red"/>}
			{!isOver && canDrop && <Overlay color="yellow"/>}
			{isOver && canDrop && <Overlay color="green"/>}
		</div>);
};
