import {DiagramData} from "../../Diagram/DiagramWrapper";
import React, {FC} from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

interface ExportProps {
    diagramData?: DiagramData | null;
}

const Export: FC<ExportProps> = ({diagramData}) => {

    const  exportDiagramAsPNG = () => {
        let imgOptions = {
            background: "white",  // Background color of the image
            scale: NaN,            // Scale factor of the image
            type: "image/png"      // Image type
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
