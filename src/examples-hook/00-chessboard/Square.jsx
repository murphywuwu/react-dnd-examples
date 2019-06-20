import React from 'react';
const squareStyle = {
    width: '100%',
    height: '100%',
};
// 主要用于装饰组件样式
export const Square = ({ black, children }) => {
    const backgroundColor = black ? 'black' : 'white';
    const color = black ? 'white' : 'black';
    return (<div style={{
        ...squareStyle,
        color,
        backgroundColor,
    }}>
			{children}
		</div>);
};
