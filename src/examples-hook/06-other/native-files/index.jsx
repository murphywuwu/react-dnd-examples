import React from 'react';
import { useState, useCallback } from 'react';
import TargetBox from './TargetBox';
import FileList from './FileList';
const Container = () => {
    const [droppedFiles, setDroppedFiles] = useState([]);
    const handleFileDrop = useCallback((item, monitor) => {
        if (monitor) {
            // 获取放置的文件数据
            const files = monitor.getItem().files;
            setDroppedFiles(files);
        }
    }, []);
    return (<>
			<TargetBox onDrop={handleFileDrop}/>
			<FileList files={droppedFiles}/>
		</>);
};
export default Container;
