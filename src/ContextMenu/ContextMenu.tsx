import React, {useState} from "react";
import MuiPopover from "@mui/material/Popover";
import {Slider} from "@mui/material";

import Settings from "@mui/icons-material/Settings";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


//components
import Select from "../components/Select";
import Orientation from "./components/Orientation";
import Export from "./components/Export";
import Layouts from "./components/Layouts";

//helpers
import {updateDiagramWithUpstreamData} from "./utils";
import {DiagramData} from "../Diagram/DiagramWrapper";
import {findMaxNestingLevel, transformData} from "../utils";
import {data1} from "../mock";


type Setting = {
    itemToRender: React.ReactNode,
    onClick?: (arg: any) => void
}


interface ContextMenuProps {
    isOpen: boolean,
    xPosition?: number,
    yPosition?: number,
    onClose: () => void,
    diagramData?: DiagramData | null;
}


const ContextMenu: React.FC<ContextMenuProps> = (
    {
        isOpen,
        xPosition,
        yPosition,
        onClose,
        diagramData,
    }) => {

    const maxLevelOfNesting = findMaxNestingLevel(data1);

    const [currentLevel, setCurrentLevel] = useState<number>(maxLevelOfNesting)

    const handleSlider = (e: Event) => {

        if (diagramData) {
            //@ts-ignore
            diagramData.model.startTransaction("changeLevels");
            //@ts-ignore
            setCurrentLevel(typeof e.target?.value === "number" ? e.target.value : maxLevelOfNesting)
            //@ts-ignore
            diagramData.model.nodeDataArray = transformData(data1, undefined, e.target.value).nodeDataArray
            //@ts-ignore
            diagramData.commitTransaction("changeLevels");
        }
    }


    const BAR_SETTINGS: Setting[] = [
        {itemToRender: <Settings/>},
        {itemToRender: <AccountTreeOutlinedIcon/>},
        {itemToRender: <SchemaOutlinedIcon/>, onClick: updateDiagramWithUpstreamData},
        {itemToRender: <Orientation diagramData={diagramData}/>},
        {itemToRender: <Layouts diagramData={diagramData}/>},
        {itemToRender: <Export diagramData={diagramData}/>},
        {itemToRender: <DeleteOutlinedIcon/>},
        {
            itemToRender: <Slider
                className="contextMenu__item__slider"
                step={1}
                min={0}
                max={maxLevelOfNesting}
                value={currentLevel}
                onChange={handleSlider}/>
        },
        {
            itemToRender: (
                <Select
                    className="contextMenu__item__select"
                    options={[{value: 1, label: "1"}, {value: 2, label: "2"}]}
                    onChange={() => null}
                />
            )
        }
    ]


    return (
        <MuiPopover
            style={{position: "absolute", top: yPosition, left: xPosition, display: !isOpen ? "none" : "block"}}
            disablePortal={true}
            open={isOpen}
            onClose={onClose}
            anchorReference="none"
            id="id"
        >
            <div className="contextMenu">
                {BAR_SETTINGS.map((setting, index) => (
                    <div
                        key={index}
                        className="contextMenu__item"
                        onClick={() => setting.onClick ? setting.onClick(diagramData) : null}>
                        {setting.itemToRender}
                    </div>
                ))}
            </div>
        </MuiPopover>
    );
};

export default ContextMenu;
