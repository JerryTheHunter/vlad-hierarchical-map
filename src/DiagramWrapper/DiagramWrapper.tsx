import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

//helpers
import { DiagramData } from '../App';
import useGo from "../hooks/useGo";

import './Diagram.scss';


interface DiagramProps {
    diagramData: DiagramData;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
}

export function DiagramWrapper(props: DiagramProps) {
    const {initDiagram, diagramRef} = useGo({onDiagramEvent:props.onDiagramEvent});

    return (
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
    );
};
