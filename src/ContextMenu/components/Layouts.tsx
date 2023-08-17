

import React, {FC} from "react";
import * as go from "gojs";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
//components
import Popover from "../../components/Popover";
import {DiagramData} from "../../Diagram/DiagramWrapper";

//helpers
import {LayoutEnum} from "../../utils";


interface LayoutsProps {
    diagramData?: DiagramData | null;
}


const Layouts: FC<LayoutsProps> = ({diagramData}) => {

    const changeLayout = (diagram:any, type: keyof typeof LayoutEnum) => {
        diagram.startTransaction("changeLayout");

        const updatedNodeTemplateMap = new go.Map(diagram.nodeTemplateMap);
        updatedNodeTemplateMap.set("", updatedNodeTemplateMap.get(LayoutEnum[type]));

        // Update the diagram's groupTemplateMap
        diagram.nodeTemplateMap = updatedNodeTemplateMap;

        diagram.commitTransaction("changeLayout");

    }

    const handleClick = (type: keyof typeof LayoutEnum) =>{
        //@ts-ignore
        changeLayout(diagramData, type )
    }



    const content = (
        <div className="orientation__content">
        <span className="contextMenu__item">
            <AutoAwesomeMosaicIcon onClick={() => handleClick("traditional")}/>
        </span>
            <span className="contextMenu__item">
            <ViewWeekIcon onClick={() => handleClick("compact")}/>
        </span>
            <span className="contextMenu__item">
            <TableRowsIcon onClick={() => handleClick("text")}/>
        </span>
        </div>
    )


    return (
        <Popover content={content}>
            <GridViewIcon/>
        </Popover>)

}

export default Layouts