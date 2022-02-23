import * as React from "react";
import {Button} from "antd";

export type ShowOnClick = () => void

export type ShowButtonProps = {
    loading: boolean
    disabled: boolean
    onClick: ShowOnClick
}

export const ShowButton = ({disabled, loading, onClick}: ShowButtonProps) => {

    return <Button type={"primary"} size={"large"} onClick={onClick} className={"drawButton"} disabled={disabled} loading={loading}><span>SHOW</span></Button>
}