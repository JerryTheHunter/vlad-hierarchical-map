import * as go from "gojs";


const $ = go.GraphObject.make;

const gridComparer =  (pa:go.ObjectData, pb:go.ObjectData) => {

    var da = Number(Boolean(pa.data.isGroup));
    var db = Number(Boolean(pb.data.isGroup));

    if (da > db || pa.data.children.length >pb.data.children.length ) return -1;
    if (da < db || pa.data.children.length < pb.data.children.length ) return 1;
    return 0;
}

export const nodeTemplate = $(go.Node, "Auto",
    {resizable: true, minSize: new go.Size(162, 62)},
    $(go.Shape, "RoundedRectangle", {fill: "white", fromLinkable: true, toLinkable: true,}),
    $(go.Panel, "Table",
        {
            stretch: go.GraphObject.Fill,
            margin: 0.5,
            fromLinkable: true,
            toLinkable: true,
        },
        $(go.RowColumnDefinition,
            {column: 0, sizing: go.RowColumnDefinition.None, background: "white"}),
        $(go.RowColumnDefinition,
            {column: 1, minimum: 100, background: "white", separatorStroke: null}),
        $(go.RowColumnDefinition,
            {row: 0, sizing: go.RowColumnDefinition.None}),
        $(go.RowColumnDefinition,
            {row: 1, separatorStroke: null}),

        $(go.TextBlock,
            {
                row: 0,
                editable: true,
                column: 1,
                stretch: go.GraphObject.Horizontal,
                margin: new go.Margin(0, 0, 20, 0),
                font: '22px serif',
                textAlign: "center",
                fromLinkable: true,
                toLinkable: true
            },
            new go.Binding("text", "tableLabel")
        ),
        $(go.TextBlock,
            {row: 1, column: 1, stretch: go.GraphObject.Fill, margin: 2, textAlign: "center", editable: true},
            new go.Binding("text", "name")),
    ),
)

export const nodeTemplateCompact = $(go.Node, "Auto",
    {resizable: true, minSize: new go.Size(162, 62)},
    $(go.Shape, "RoundedRectangle", {fill: "white", fromLinkable: true, toLinkable: true,}),
    $(go.Panel, "Table",
        {
            stretch: go.GraphObject.Fill,
            margin: 0.5,
            fromLinkable: true,
            toLinkable: true,
        },
        $(go.RowColumnDefinition,
            {column: 0, sizing: go.RowColumnDefinition.None, background: "white"}),
        $(go.RowColumnDefinition,
            {column: 1, minimum: 100, background: "white", separatorStroke: null}),
        $(go.RowColumnDefinition,
            {row: 0, sizing: go.RowColumnDefinition.None}),
        $(go.RowColumnDefinition,
            {row: 1, separatorStroke: null}),

        $(go.TextBlock,
            {
                row: 0,
                editable: true,
                column: 1,
                stretch: go.GraphObject.Horizontal,
                margin: new go.Margin(0, 0, 20, 0),
                font: '22px serif',
                textAlign: "center",
                fromLinkable: true,
                toLinkable: true
            },
            new go.Binding("text", "name")
        )
    ),
)

export const textOnlyNodeTemplate = $(go.Node, "Auto",
    {resizable: true, minSize: new go.Size(162, 62)},

    $(go.Panel, "Table",
        {
            stretch: go.GraphObject.Fill,
            margin: 0.5,
            fromLinkable: true,
            toLinkable: true,
        },
        $(go.RowColumnDefinition,
            {column: 0, sizing: go.RowColumnDefinition.None, background: "white"}),
        $(go.RowColumnDefinition,
            {column: 1, minimum: 100, background: "white", separatorStroke: null}),
        $(go.RowColumnDefinition,
            {row: 0, sizing: go.RowColumnDefinition.None}),
        $(go.RowColumnDefinition,
            {row: 1, separatorStroke: null}),

        $(go.TextBlock,
            {
                row: 0,
                editable: true,
                column: 1,
                stretch: go.GraphObject.Horizontal,
                margin: new go.Margin(0, 0, 20, 0),
                font: '22px serif',
                textAlign: "center",
                fromLinkable: true,
                toLinkable: true
            },
            new go.Binding("text", "name")
        )
    ),
)

function finishDrop(e:any, grp:any) {

    var ok = (grp !== null
        ? grp.addMembers(grp.diagram.selection, true)
        : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    if (!ok) e.diagram.currentTool.doCancel();
}

function highlightGroup(e:any, grp:any, show:any) {
    if (!grp) return;
    e.handled = true;
    if (show) {
        // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
        // instead depend on the DraggingTool.draggedParts or .copiedParts
        var tool = grp.diagram.toolManager.draggingTool;
        var map = tool.draggedParts || tool.copiedParts;  // this is a Map
        // now we can check to see if the Group will accept membership of the dragged Parts
        if (grp.canAddMembers(map.toKeySet())) {
            grp.isHighlighted = true;
            return;
        }
    }
    grp.isHighlighted = false;
}

export const defaultGroupTemplate = $(
    go.Group, "Vertical",
    { computesBoundsAfterDrag: true,
        computesBoundsIncludingLocation: true,
        mouseDrop: finishDrop,
        handlesDragDropForMembers: true,
        mouseDragEnter: (e, grp, prev) => highlightGroup(e, grp, true),
        mouseDragLeave: (e, grp, next) => highlightGroup(e, grp, false),
    },
    {
        // Define the group's layout
        layout: $(go.GridLayout,
            {
                spacing: new go.Size(20, 20),
                wrappingColumn: 3,
                wrappingWidth: 800,
                alignment: go.GridLayout.Position,
                cellSize: new go.Size(0, 0),
                sorting: go.GridLayout.Ascending,
                comparer: (pa:go.ObjectData, pb:go.ObjectData) => {

                    var da = Number(Boolean(pa.data.isGroup));
                    var db = Number(Boolean(pb.data.isGroup));
                    if (da > db) return -1;
                    if (da < db) return 1;
                    return 0;
                }


            }) // Add spacing between elements
    },
    new go.Binding("background", "isHighlighted", h => h ? "rgba(194,252,214,0.2)" : "transparent").ofObject(),
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
                    editable: true
                },
                new go.Binding("text", "name", (name) => {
                    return name || "No label"
                }),
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
                {padding: 20,} // Add margin between the Placeholder and the inner rectangle
            ),
        )
    )
);


export const generateMapGroupTemplate = () => {
    return $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.TreeLayout,
                {
                    angle: 90,
                    layerSpacing: 100,
                    nodeSpacing: 100,
                },
            )
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
                {padding: 20, alignment: go.Spot.Center} // Add margin between the Placeholder and the inner rectangle
            ),
        )
    );
}

export const getNodesGroup = (gridColumnsCount: number) => {

    return $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(20, 20),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: gridColumnsCount,
                    wrappingWidth: 10000,
                    cellSize: new go.Size(20, 20),
                    comparer: gridComparer
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            {padding: 20,} // Add margin between the Placeholder and the inner rectangle
        ),
    );
}


export const generateNodesGroupVertical = () => {
    return $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(20, 20),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: 1,
                    cellSize: new go.Size(20, 0),
                    comparer: gridComparer
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            {padding: 20,} // Add margin between the Placeholder and the inner rectangle
        ),
    );

}

export const generateNodesGroupHorizontal = () => {
    return $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(20, 20),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: 2000,
                    wrappingWidth: 20000,
                    cellSize: new go.Size(20, 0),
                    comparer: gridComparer
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            {padding: 20,} // Add margin between the Placeholder and the inner rectangle
        ),
    );
}

export const getUpstreamGroup = (gridColumnsCount: number) => {
    return $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(0, 0),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: gridColumnsCount,
                    wrappingWidth: 10000,
                    cellSize: new go.Size(20, 0)
                }) // Add spacing between elements
        },
        $(
            go.Panel,
            "Auto",
            {
                alignment: go.Spot.Center, // Align the container to the center of the group cell
            },
        ),
        $(
            go.Placeholder, // represents the area of all member parts,
            {padding: 20,} // Add margin between the Placeholder and the inner rectangle
        ),
    );
};
