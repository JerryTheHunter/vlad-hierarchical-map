import {ReactNode, FC} from "react";
import MuiSelect, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import "../../styles/components/Select.scss"

type MenuSelectProps = {
    className?: string,
    label?: string,
    options: Array<{ label: string, value: any }>;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
    value?: string
}

export const Select: FC<MenuSelectProps> = (props) => {
    const {className, label, options, onChange, value = ""} = props;

    return (
        <MuiSelect
            className={`hm-select ${className}`}
            label={label}
            onChange={onChange}
            value={value}
        >
            {options.map(option => (
                <MenuItem key={option.label} value={option.value}>{option.label}</MenuItem>)
            )}
        </MuiSelect>
    )
}