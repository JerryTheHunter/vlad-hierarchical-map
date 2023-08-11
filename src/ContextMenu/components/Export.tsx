import React, {FC} from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import {DiagramData} from "../../Diagram/DiagramWrapper";

interface ExportProps {
    diagramData?: DiagramData | null;
}

const Export: FC<ExportProps> = ({diagramData}) => {

    const  exportDiagramAsPNG = () => {
        let imgOptions = {
            background: "white",
            scale: NaN,
            type: "image/png",
        };

        //@ts-ignore
        const blob = diagramData?.makeImageData(imgOptions)
        let link = document.createElement("a");
        link.href = blob;
        link.download = "diagram.png";
        link.click();
    }

    return <AttachFileOutlinedIcon onClick={exportDiagramAsPNG}/>
}
export default Export;
