import * as go from "gojs";
import {useCallback, useEffect, useState} from "react";
import {ReactDiagram} from "gojs-react";
import {DiagramEvent} from "gojs"

//helpers
import {GuidedDraggingTool} from "../GuidedDraggingTool";


interface UseGoProps {
    onDiagramEvent: (e:DiagramEvent) => void;
}

const useGo = ({onDiagramEvent}: UseGoProps) => {
    const [diagram, setDiagram] = useState<go.Diagram | null>(null);

    // Cleanup
    useEffect(() => {
        return () => {
            if (diagram instanceof go.Diagram) {
                diagram.removeDiagramListener('ChangedSelection', onDiagramEvent);
            }
        };
    }, [diagram, onDiagramEvent]);


    /**
     * Diagram initialization method, which is passed to the ReactDiagram component.
     * This method is responsible for making the diagram and initializing the model, any templates,
     * and maybe doing other initialization tasks like customizing tools.
     * The model's data should not be set here, as the ReactDiagram component handles that.
     */
    const initDiagram = (): go.Diagram => {
        const $ = go.GraphObject.make;

        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        go.Shape.defineFigureGenerator("Underline", function(shape, w, h) {
            return new go.Geometry()
                .add(new go.PathFigure(0, h, false)
                    .add(new go.PathSegment(go.PathSegment.Line, 0, 0))
                    .add(new go.PathSegment(go.PathSegment.Line, w, 0)));
        });

        const diagram =
            $(go.Diagram,
                {
                    'undoManager.isEnabled': true,  // must be set to allow for model change listening
                    'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
                    draggingTool: new GuidedDraggingTool(),
                    'draggingTool.horizontalGuidelineColor': 'blue',
                    'draggingTool.verticalGuidelineColor': 'blue',
                    'draggingTool.centerGuidelineColor': 'green',
                    'draggingTool.guidelineWidth': 1,
                    "draggingTool.gridSnapCellSpot": go.Spot.Center,
                    layout: $(go.GridLayout, {wrappingWidth: 3000, wrappingColumn: 3, alignment: go.GridLayout.Position, cellSize: new go.Size(50, 0)}),
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


        diagram.nodeTemplate =
            $(go.Node, "Auto",
                { resizable: true, minSize: new go.Size(162, 62)},
                new go.Binding("padding", '', node => {
                    return node.isHeader? new go.Margin(5, 5, 100, 5) : 5
                }),
                $(go.Shape, "RoundedRectangle",{ fill: "white", fromLinkable: true, toLinkable: true, }),
                $(go.Panel, "Table",
                    {
                        stretch: go.GraphObject.Fill,
                        margin: 0.5,
                        fromLinkable: true,
                        toLinkable: true,
                    },
                    $(go.RowColumnDefinition,
                        { column: 0, sizing: go.RowColumnDefinition.None, background: "white" }),
                    $(go.RowColumnDefinition,
                        { column: 1, minimum: 100, background: "white", separatorStroke: null}),
                    $(go.RowColumnDefinition,
                        { row: 0, sizing: go.RowColumnDefinition.None }),
                    $(go.RowColumnDefinition,
                        { row: 1, separatorStroke: null}),

                    $(go.TextBlock,
                        { row: 0, editable: true, column: 1, stretch: go.GraphObject.Horizontal, margin: new go.Margin(0, 0, 20, 0),font: '22px serif', textAlign: "center", fromLinkable: true, toLinkable:true },
                        new go.Binding("text", "tableLabel")
                        ),
                    $(go.TextBlock,
                        { row: 1, column: 1, stretch: go.GraphObject.Fill, margin: 2, textAlign: "center", editable: true},
                        new go.Binding("text", "name")),
                ),
            )

        const defaultGroupTemplate = $(
            go.Group, "Vertical",
            {
                // Define the group's layout
                layout: $(go.GridLayout, { spacing: new go.Size(0, 0), wrappingColumn: 3, alignment: go.GridLayout.Location, cellSize: new go.Size(0, 0) }) // Add spacing between elements
            },
            $(
                go.Panel, "Auto",
                {
                    // Outer rectangle
                    margin: 0,
                    background: null, // Transparent fill
                    cursor: "pointer",
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides,
                },
                $(
                    go.Shape,
                    "RoundedRectangle",
                    {
                        // Inner rectangle
                        fill: null, // Transparent fill
                        stroke: "black", // Black border
                        parameter1: 14,     // Add margins to the inner rectangle
                    }
                ),
                $(
                    go.Panel, "Vertical",
                    $(
                        go.TextBlock, // Header
                        {
                            alignment: go.Spot.Center, // Align text in the center horizontally and vertically
                            font: "Bold 12pt Sans-Serif",
                            margin: 20, // Add top and bottom margin to the TextBlock
                        },
                        new go.Binding("text", "name")
                    ),
                    $(
                        go.Shape, // Underline beneath the header
                        {
                            height: 1,
                            fill: "black", // Black underline
                            stretch: go.GraphObject.Horizontal // Stretch the shape horizontally
                        }
                    ),
                    $(
                        go.Placeholder, // represents the area of all member parts,
                        { padding: 20, } // Add margin between the Placeholder and the inner rectangle
                    ),
                )
            )
        );


        // ring depends on modelData
        diagram.linkTemplate =
            $(go.Link,
                {
                    curve: go.Link.Bezier, // Use Bezier curve for curvy lines
                    adjusting: go.Link.Stretch,
                },
                $(go.Shape),                           // this is the link shape (the line)
                $(go.Shape, { toArrow: "Standard" }),  // this is an arrowhead
                $(go.TextBlock,                        // this is a Link label
                    new go.Binding("text", "text"))
            );
        const templMap = new go.Map<string, go.Group>();

        const mapGroupTemplate =  $(
            go.Group, "Vertical",
            {
                // Define the group's layout
                layout: $(go.GridLayout, { spacing: new go.Size(0, 0), alignment: go.GridLayout.Position,  wrappingColumn: 3, wrappingWidth: 3000, cellSize: new go.Size(20, 0) }) // Add spacing between elements
            },
            $(
                go.Panel, "Auto",
                {
                    // Outer rectangle
                    margin: 0,
                    background: null, // Transparent fill
                    cursor: "pointer",
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides,

                },
                $(
                    go.Panel, "Vertical",
                    $(
                        go.TextBlock, // Header
                        {
                            alignment: go.Spot.Left, // Align text in the center horizontally and vertically
                            font: "Bold 12pt Sans-Serif",
                            stroke: "rgba(188, 188, 188, 1)",
                            margin: 20, // Add top and bottom margin to the TextBlock
                        },
                        new go.Binding("text", "name")
                    ),
                    $(
                        go.Shape, // Underline beneath the header
                        {
                            height: 1,
                            fill: "black", // Black underline
                            stretch: go.GraphObject.Horizontal // Stretch the shape horizontally
                        }
                    ),
                    $(
                        go.Placeholder, // represents the area of all member parts,
                        { padding: 20, } // Add margin between the Placeholder and the inner rectangle
                    ),
                )
            )
        );

        templMap.add("mapGroup", mapGroupTemplate);
        templMap.add("", defaultGroupTemplate)

        diagram.groupTemplateMap = templMap;

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