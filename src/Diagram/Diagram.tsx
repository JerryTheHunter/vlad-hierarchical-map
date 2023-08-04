import {useState} from "react";
import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';

//components
import ContextMenu from "./components/ContextMenu";

//helpers
import useGo from "../hooks/useGo";
import {DiagramData} from "./DiagramWrapper";


import '../styles/Diagram.scss';


interface DiagramProps {
    diagramData: DiagramData;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
}

export function Diagram(props: DiagramProps) {
    const {diagramData, onDiagramEvent, onModelChange} = props;

    const openPopover = (data: any) => {
        setPopoverData(data)
    }

    const {initDiagram, diagramRef} = useGo({onDiagramEvent: onDiagramEvent, setContextMenuData: openPopover, diagramData});

    const [popoverData, setPopoverData] = useState<
        { x: number, y: number, diagram: DiagramData } | null>
    (null);

    const onClosePopover = () => {
        setPopoverData(null)
    }

    return (
        <>
            <ReactDiagram
                ref={diagramRef}
                divClassName='diagram-component'
                initDiagram={initDiagram}
                nodeDataArray={diagramData.nodeDataArray}
                linkDataArray={diagramData.linkDataArray}
                modelData={diagramData.modelData}
                onModelChange={onModelChange}
                skipsDiagramUpdate={diagramData.skipsDiagramUpdate}
            />
            <ContextMenu
                isOpen={!!popoverData}
                onClose={onClosePopover}
                xPosition={popoverData?.x}
                yPosition={popoverData?.y}
                diagramData={popoverData?.diagram}
            />
        </>
    );
}
