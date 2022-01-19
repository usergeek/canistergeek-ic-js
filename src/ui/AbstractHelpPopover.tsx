import * as React from "react";
import {Button, Popover} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {TooltipPlacement} from "antd/lib/tooltip";

type Props = {
    content: React.ReactNode
    title?: React.ReactNode
    placement?: TooltipPlacement
    iconColor?: string
}

export const AbstractHelpPopover = (props: Props) => {
    return <Popover title={props.title} placement={props.placement || "rightTop"} content={props.content} trigger={["click"]}>
        <Button shape="circle" icon={<QuestionCircleOutlined style={{color: props.iconColor}}/>} type={"text"}/>
    </Popover>
}