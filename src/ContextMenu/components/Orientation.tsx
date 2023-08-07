import React, {FC} from "react";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";

//components
import Popover from "../../components/Popover";


const content = (
    <div className="orientation__content">
        <span className="contextMenu__item">
            <AutoAwesomeMosaicIcon/>
        </span>
        <span className="contextMenu__item">
            <ViewWeekIcon/>
        </span>
        <span className="contextMenu__item">
            <TableRowsIcon/>
        </span>


    </div>
)

const Orientation: FC = () => {
    return (
        <Popover content={content}>
            <AppsOutlinedIcon/>
        </Popover>)

}

export default Orientation