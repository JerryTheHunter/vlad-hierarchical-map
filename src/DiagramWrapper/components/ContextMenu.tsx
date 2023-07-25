import React from "react";
import MuiPopover from "@mui/material/Popover";

import Settings from "@mui/icons-material/Settings";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import {Slider} from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type MenuSelectProps = {
    className: string
}


const MenuSelect: React.FC<MenuSelectProps> = ({className}) => {
    return <Select
        className={className}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Age"
    >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
    </Select>
}

type Setting = {
    itemToRender: React.ReactNode
}


 const BAR_SETTINGS: Setting[] = [
    {itemToRender: <Settings/>},
    {itemToRender: <AccountTreeOutlinedIcon/>},
    {itemToRender: <SchemaOutlinedIcon/>},
    {itemToRender: <AppsOutlinedIcon/>},
    {itemToRender: <AttachFileOutlinedIcon/>},
    {itemToRender: <DeleteOutlinedIcon/>},
    {itemToRender: <Slider className="contextMenu__item__slider"/>},
    {itemToRender: <MenuSelect className="contextMenu__item__select"/>}
]

interface ContextMenuProps {
    isOpen: boolean,
    xPosition?: number,
    yPosition?: number,
    onClose: () => void,
}

const ContextMenu:React.FC<ContextMenuProps> = (
    {
        isOpen,
        xPosition,
        yPosition,
         onClose
    }) => {

    return (
            <MuiPopover
                style={{position: "absolute", top: yPosition, left: xPosition, display: !isOpen? "none": "block"}}
                disablePortal={true}
                open={isOpen}
                onClose={onClose}
                anchorReference="none"
                id="id"
            >
                <div className="contextMenu">
                    {BAR_SETTINGS.map((setting, index) => (
                        <div key={index} className="contextMenu__item">{setting.itemToRender}</div>
                    ))}
                </div>
            </MuiPopover>
    );
};

export default ContextMenu;
