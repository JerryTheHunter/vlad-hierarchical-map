import React, {FC} from "react";
import * as go from "gojs";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";

//components
import Popover from "../../components/Popover";
import {DiagramData} from "../../Diagram/DiagramWrapper";

//helpers
import {OrientationEnum} from "../../utils";


interface OrientationProps {
    diagramData?: DiagramData | null;
}



const Orientation: FC<OrientationProps> = ({diagramData}) => {

    const changeOrientation = (diagram:any, type: keyof typeof OrientationEnum) => {

        diagram.model.startTransaction("changeLayout");

        const updatedGroupTemplateMap = new go.Map(diagram.groupTemplateMap);
        // Remove the "mapGroup" template from the copied map
        updatedGroupTemplateMap.add("nodesGroup", updatedGroupTemplateMap.get(OrientationEnum[type]) );

        // Update the diagram's groupTemplateMap
        diagram.groupTemplateMap = updatedGroupTemplateMap;

        diagram.model.commitTransaction("changeLayout");

    }

    const handleClick = (type: keyof typeof OrientationEnum) =>{
        //@ts-ignore
       changeOrientation(diagramData, type )
    }



    const content = (
        <div className="orientation__content">
        <span className="contextMenu__item">
            <AutoAwesomeMosaicIcon onClick={() => handleClick("auto")}/>
        </span>
            <span className="contextMenu__item">
            <ViewWeekIcon onClick={() => handleClick("vertical")}/>
        </span>
            <span className="contextMenu__item">
            <TableRowsIcon onClick={() => handleClick("horizontal")}/>
        </span>
        </div>
    )


    return (
        <Popover content={content}>
            <AppsOutlinedIcon/>
        </Popover>)

}

export default Orientation