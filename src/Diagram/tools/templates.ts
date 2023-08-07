import * as go from "gojs";


const $ = go.GraphObject.make;

export const nodeTemplate =  $(go.Node, "Auto",
    { resizable: true, minSize: new go.Size(162, 62)},
    new go.Binding("padding", '', node => {
        return node.isUpstream? new go.Margin(5, 5, 100, 5) : 5
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

export const defaultGroupTemplate = $(
    go.Group, "Vertical",
    {
        // Define the group's layout
        layout: $(go.GridLayout,
            {
                spacing: new go.Size(0, 0),
                wrappingColumn: 3,
                alignment:
                go.GridLayout.Location,
                cellSize: new go.Size(0, 0),
            }) // Add spacing between elements
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


export const generateMapGroupTemplate = () => {
    return  $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(0, 0),
                    alignment: go.GridLayout.Location,
                    wrappingColumn: 1,
                    cellSize: new go.Size(20, 0) }) // Add spacing between elements
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
                    { padding: 20, alignment: go.Spot.Center } // Add margin between the Placeholder and the inner rectangle
                ),
            )
    );
}

export const getNodesGroup = (gridColumnsCount:number) => {

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
                    cellSize: new go.Size(20, 0)
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            { padding: 20, } // Add margin between the Placeholder and the inner rectangle
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
                    spacing: new go.Size(0, 0),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: 1,
                    cellSize: new go.Size(20, 0)
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            { padding: 20, } // Add margin between the Placeholder and the inner rectangle
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
                    spacing: new go.Size(0, 0),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: 2000,
                    wrappingWidth: 20000,
                    cellSize: new go.Size(20,   0)
                }) // Add spacing between elements
        },
        $(
            go.Placeholder, // represents the area of all member parts,
            { padding: 20, } // Add margin between the Placeholder and the inner rectangle
        ),
    );
}

export const getUpstreamGroup = (gridColumnsCount: number) => {
    return  $(
        go.Group,
        {
            // Define the group's layout
            layout: $(go.GridLayout,
                {
                    spacing: new go.Size(0, 0),
                    alignment: go.GridLayout.Position,
                    wrappingColumn: gridColumnsCount,
                    wrappingWidth: 10000,
                    cellSize: new go.Size(20, 0) }) // Add spacing between elements
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
            { padding: 20, } // Add margin between the Placeholder and the inner rectangle
        ),
    );
}