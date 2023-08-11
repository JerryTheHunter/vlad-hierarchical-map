import {cloneElement, FC, isValidElement, MouseEvent, ReactElement, useState} from "react";
import {Popover as MuiPopover} from "@mui/material";
import {PopoverProps as MuiPopoverProps} from "@mui/material";


interface PopoverProps extends Omit<MuiPopoverProps, 'open' | 'content'> {
    children: ReactElement,
    content: ReactElement,
    open?: boolean
}


const Popover: FC<PopoverProps> = (props) => {
    const {
        content,
        children,
        anchorOrigin = {
            vertical: 'bottom',
            horizontal: 'center',
        },
        transformOrigin = {
            vertical: 'top',
            horizontal: 'center',
        },
        open,
        ...rest
    } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            {isValidElement(children) && cloneElement(children as ReactElement, {onClick: handleClick})}
            <MuiPopover
                {...rest}
                id={"popover"}
                open={open || !!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            >
                {content}
            </MuiPopover>
        </div>
    )
}

export default Popover;