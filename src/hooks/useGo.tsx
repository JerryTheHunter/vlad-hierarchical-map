import * as go from "gojs";
import {useCallback, useEffect, useState} from "react";
import {ReactDiagram} from "gojs-react";
import {DiagramEvent} from "gojs"


//helpers
import {GuidedDraggingTool} from "../Diagram/tools/GuidedDraggingTool";
import {
    defaultGroupTemplate,
    generateMapGroupTemplate,
    generateNodesGroupHorizontal,
    generateNodesGroupVertical, getNodesGroup, getUpstreamGroup,
    nodeTemplate,
    nodeTemplateCompact,
    textOnlyNodeTemplate
} from "../Diagram/tools/templates";
import {DiagramData} from "../Diagram/DiagramWrapper";


interface UseGoProps {
    onDiagramEvent: (e: DiagramEvent) => void;
    setContextMenuData: (data: any) => void;
    diagramData: DiagramData
}

const useGo = ({onDiagramEvent, setContextMenuData, diagramData}: UseGoProps) => {
    const [diagram, setDiagram] = useState<go.Diagram | null>(null);

    // Cleanup
    useEffect(() => {
        return () => {
            if (diagram instanceof go.Diagram) {
                diagram.removeDiagramListener('ChangedSelection', onDiagramEvent);
            }
        };
    }, [diagram, onDiagramEvent]);


    const initDiagram = (): go.Diagram => {
        const $ = go.GraphObject.make;

        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        go.Shape.defineFigureGenerator("Underline", function (shape, w, h) {
            return new go.Geometry()
                .add(new go.PathFigure(0, h, false)
                    .add(new go.PathSegment(go.PathSegment.Line, 0, 0))
                    .add(new go.PathSegment(go.PathSegment.Line, w, 0)));
        });

        const diagram =
            $(go.Diagram,
                {
                    'undoManager.isEnabled': true,  // must be set to allow for model change listening
                    'clickCreatingTool.archetypeNodeData': {text: 'new node', color: 'lightblue'},
                    draggingTool: new GuidedDraggingTool(),
                    'draggingTool.horizontalGuidelineColor': 'blue',
                    'draggingTool.verticalGuidelineColor': 'blue',
                    'draggingTool.centerGuidelineColor': 'green',
                    'draggingTool.guidelineWidth': 1,
                    "draggingTool.gridSnapCellSpot": go.Spot.Center,
                    layout: $(go.GridLayout, {
                        wrappingWidth: 3000,
                        wrappingColumn: 3,
                        alignment: go.GridLayout.Position,
                        cellSize: new go.Size(50, 0)
                    }),
                    model: $(go.GraphLinksModel,
                        {
                            linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                            // positive keys for nodes
                            makeUniqueKeyFunction: (m: go.Model, data: any) => {
                                let k = data.key || 1;
                                while (m.findNodeDataForKey(k)) k++;
                                data.key = k;
                                return k;
                            },
                            // negative keys for links
                            makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                                let k = data.key || -1;
                                while (m.findLinkDataForKey(k)) k--;
                                data.key = k;
                                return k;
                            }
                        }),
                });

        diagram.nodeTemplate = nodeTemplate;

        // ring depends on modelData
        diagram.linkTemplate =
            $(go.Link, go.Link.Bezier, {
                    curviness: -320, relinkableFrom: false,
                    relinkableTo: false, selectable: true, zOrder: 10
                },
                $(go.Shape),
                $(go.Shape, {toArrow: "Standard"}),  // this is an arrowhead
                $(go.TextBlock, {editable: true},                        // this is a Link label
                    new go.Binding("text", "text"))
            );

        const groupTemplMap = new go.Map<string, go.Group>();

        const gridColumnsCount = diagramData.nodeDataArray.filter(item => item.isUpstream).length || 1;
        groupTemplMap.add("mapGroup", generateMapGroupTemplate());

        groupTemplMap.add("upstreamGroup", getUpstreamGroup(gridColumnsCount));

        //orientations
        groupTemplMap.add("nodesGroup", getNodesGroup(3));

        groupTemplMap.add("nodesGroupDefault", getNodesGroup(3))
        groupTemplMap.add("nodesGroupVertical", generateNodesGroupVertical());
        groupTemplMap.add("nodesGroupHorizontal", generateNodesGroupHorizontal());


        groupTemplMap.add("", defaultGroupTemplate)

        diagram.groupTemplateMap = groupTemplMap;


        const templMap = new go.Map<string, go.Node>();

        templMap.add("", nodeTemplate)

        templMap.add("defaultNodeTemplate", nodeTemplate)
        templMap.add("compactNodeTemplate", nodeTemplateCompact)
        templMap.add("textOnlyNodeTemplate", textOnlyNodeTemplate)


        diagram.nodeTemplateMap = templMap;

        //show context menu
        diagram.addDiagramListener("ChangedSelection", function () {
            const selectedParts = diagram.selection;
            if (selectedParts.count === 1) {
                const part = selectedParts.first();
                if (part instanceof go.Group && part.data.category) {
                    const viewPoint = diagram.transformDocToView(part.location);
                    const x = viewPoint.x;
                    const y = viewPoint.y - 50;
                    setContextMenuData({x, y, diagram})
                }
            }
        });

        return diagram;
    };


    const diagramRef = useCallback((ref: ReactDiagram | null) => {
        if (ref != null) {
            setDiagram(ref.getDiagram());
            if (diagram instanceof go.Diagram) {
                diagram.addDiagramListener('ChangedSelection', onDiagramEvent);
            }
        }
    }, [diagram, onDiagramEvent]);


    return {initDiagram, diagramRef, diagram}
}

export default useGo;