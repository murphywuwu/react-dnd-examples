import React, { useState, useEffect, useCallback } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';
import ItemTypes from './ItemTypes';
import update from 'immutability-helper';
// @ts-ignore
import shuffle from 'lodash/shuffle';
const Container = () => {
    const [dustbins, setDustbins] = useState([
        { accepts: [ItemTypes.GLASS], lastDroppedItem: null },
        { accepts: [ItemTypes.FOOD], lastDroppedItem: null },
        {
            accepts: [ItemTypes.PAPER, ItemTypes.GLASS, NativeTypes.URL],
            lastDroppedItem: null,
        },
        { accepts: [ItemTypes.PAPER, NativeTypes.FILE], lastDroppedItem: null },
    ]);
    const [boxes, setBoxes] = useState([
        { name: 'Bottle', type: ItemTypes.GLASS },
        { name: 'Banana', type: ItemTypes.FOOD },
        { name: 'Magazine', type: ItemTypes.PAPER },
    ]);
    const [droppedBoxNames, setDroppedBoxNames] = useState([]);
    useEffect(() => {
        // 关键代码
        const interval = setInterval(() => {
            setBoxes(shuffle(boxes));
            setDustbins(shuffle(dustbins));
        }, 1000);
        return () => clearInterval(interval);
    });
    const isDropped = (boxName) => droppedBoxNames.indexOf(boxName) > -1;
    const handleDrop = useCallback((index, item) => {
        const { name } = item;
        setDustbins(update(dustbins, {
            [index]: {
                lastDroppedItem: {
                    $set: item,
                },
            },
        }));
        setDroppedBoxNames(update(droppedBoxNames, name
            ? {
                $push: [name],
            }
            : {}));
    }, [dustbins, droppedBoxNames]);
    return (<div>
			<div style={{ overflow: 'hidden', clear: 'both' }}>
				{dustbins.map(({ accepts, lastDroppedItem }, index) => (<Dustbin accepts={accepts} lastDroppedItem={lastDroppedItem} onDrop={item => handleDrop(index, item)} key={index}/>))}
			</div>

			<div style={{ overflow: 'hidden', clear: 'both' }}>
				{boxes.map(({ name, type }, index) => (<Box name={name} type={type} isDropped={isDropped(name)} key={index}/>))}
			</div>
		</div>);
};
export default Container;
