import React, { useState, useCallback, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import Colors from './Colors';
const style = {
    border: '1px dashed gray',
    padding: '0.5rem',
    margin: '0.5rem',
};
const SourceBox = ({ color, children }) => {
    const [forbidDrag, setForbidDrag] = useState(false);
    const [{ isDragging }, drag] = useDrag({
        // 根据color区分不同类型的拖曳块
        item: { type: `${color}` },
        // 控制是否能拖曳
        canDrag: !forbidDrag,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const onToggleForbidDrag = useCallback(() => {
        setForbidDrag(!forbidDrag);
    }, [forbidDrag]);

    // useMemo：用于缓存值。
    // 每当color发生变化，则返回最新值。否则返回缓存值
    const backgroundColor = useMemo(() => {
        switch (color) {
            case Colors.YELLOW:
                return 'lightgoldenrodyellow';
            case Colors.BLUE:
                return 'lightblue';
            default:
                return 'lightgoldenrodyellow';
        }
    }, [color]);
    const containerStyle = useMemo(() => ({
        ...style,
        backgroundColor,
        opacity: isDragging ? 0.4 : 1,
        cursor: forbidDrag ? 'default' : 'move',
    }), [isDragging, forbidDrag, backgroundColor]);
    return (<div ref={drag} style={containerStyle}>
			<input type="checkbox" checked={forbidDrag} onChange={onToggleForbidDrag}/>
			<small>Forbid drag</small>
			{children}
		</div>);
};
export default SourceBox;
