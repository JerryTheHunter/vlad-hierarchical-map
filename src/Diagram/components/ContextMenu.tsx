import React from "react";
import MuiPopover from "@mui/material/Popover";
import {Slider} from "@mui/material";

import Settings from "@mui/icons-material/Settings";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

//components
import Select from "../../components/Select";

//helpers
import {updateDiagramWithUpstreamData} from "./utils";


type Setting = {
    itemToRender: React.ReactNode,
    onClick?: (arg: any) => void
}

const BAR_SETTINGS: Setting[] = [
    {itemToRender: <Settings/>},
    {itemToRender: <AccountTreeOutlinedIcon/>},
    {itemToRender: <SchemaOutlinedIcon/>, onClick: updateDiagramWithUpstreamData},
    {itemToRender: <AppsOutlinedIcon/>},
    {itemToRender: <AttachFileOutlinedIcon/>},
    {itemToRender: <DeleteOutlinedIcon/>},
    {itemToRender: <Slider className="contextMenu__item__slider"/>},
    {
        itemToRender: (
            <Select
                className="contextMenu__item__select"
                options={[{value: 1, label: "1"}, {value: 2, label: "2"}]}
                onChange={(el) => console.log(el)}
            />
        )
    }
]

interface ContextMenuProps {
    isOpen: boolean,
    xPosition?: number,
    yPosition?: number,
    onClose: () => void,
    diagramData?: any;
}


const ContextMenu: React.FC<ContextMenuProps> = (
    {
        isOpen,
        xPosition,
        yPosition,
        onClose,
        diagramData,
    }) => {


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
