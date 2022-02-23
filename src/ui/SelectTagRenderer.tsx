import React, {PropsWithChildren} from "react";
import {CloseOutlined} from "@ant-design/icons";
import _ from "lodash"
import {CustomTagProps} from "rc-select/lib/BaseSelect";

export const SelectValue_NotSetValueLabel = "(none)"

type Props = {
    onClick: () => void,
    closable: boolean,
}

const SelectTag = ({onClick, closable, children}: PropsWithChildren<Props>) => {
    const closableComponent = closable ? <span className="ant-select-selection-item-remove" unselectable="on" aria-hidden="true"><CloseOutlined onClick={onClick}/></span> : null
    return <span className="ant-select-selection-item ug-select-tag">
        <span className="ant-select-selection-item-content">{children}</span>
        {closableComponent}
    </span>
}

export const SelectTagRenderer = (props: CustomTagProps) => {
    const {label, value, closable, onClose} = props;
    if (_.isNil(value)) {
        return <SelectTag onClick={onClose} closable={closable}>
            {SelectValue_NotSetValueLabel}
        </SelectTag>
    }
    return <SelectTag onClick={onClose} closable={closable}>
        {label}
    </SelectTag>
}
