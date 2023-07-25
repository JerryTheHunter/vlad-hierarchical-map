import {useState} from "react";
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

//helpers
import { DiagramData } from '../App';
import useGo from "../hooks/useGo";

//components
import ContextMenu from "./components/ContextMenu";


import '../styles/Diagram.scss';


interface DiagramProps {
    diagramData: DiagramData;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
}

export function DiagramWrapper(props: DiagramProps) {

    const openPopover = (data: any) => {
        setShowPopover(data)
    }

    const { initDiagram, diagramRef } = useGo({onDiagramEvent: props.onDiagramEvent, showContextMenu: openPopover});

    const [ showPopover, setShowPopover] = useState<{x: number, y:number} | null>(null);

    const onClosePopover = () => {
        setShowPopover(null)
    }

    return (<>
        <ReactDiagram
            ref={diagramRef}
            divClassName='diagram-component'
            initDiagram={initDiagram}
            nodeDataArray={props.diagramData.nodeDataArray}
            linkDataArray={props.diagramData.linkDataArray}
            modelData={props.diagramData.modelData}
            onModelChange={props.onModelChange}
            skipsDiagramUpdate={props.diagramData.skipsDiagramUpdate}
        />
            <ContextMenu isOpen={!!showPopover} onClose={onClosePopover} xPosition={showPopover?.x} yPosition={showPopover?.y}/>
        </>
    );
}
