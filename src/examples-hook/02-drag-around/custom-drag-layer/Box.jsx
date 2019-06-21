import React from 'react';
const styles = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    cursor: 'move',
};

/* 同时被DraggbleBox以及BoxDragPreview使用 */
const Box = ({ title, yellow }) => {
    const backgroundColor = yellow ? 'yellow' : 'white';
    return <div style={{ ...styles, backgroundColor }}>{title}</div>;
};
export default Box;
