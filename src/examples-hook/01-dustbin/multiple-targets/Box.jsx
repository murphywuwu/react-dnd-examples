import React from 'react';
import { useDrag } from 'react-dnd';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
const Box = ({ name, type, isDropped }) => {
    const [{ opacity }, drag] = useDrag({
        item: { name, type },
        canDrag: (monitor) => { console.log('canDrag', monitor); return true },
        begin: (monitor) => { 
          console.log('begin', monitor);

          // if an object is returned it will override the default item property of the spec
          return { name: 'wuwu' } 
        },
        isDragging: (monitor) => { console.log('isDragging', monitor) },
        end: (item) => { console.log('end', item) },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
        }),
    });
    return (<div ref={drag} style={{ ...style, opacity }}>
			{isDropped ? <s>{name}</s> : name}
		</div>);
};
export default Box;
