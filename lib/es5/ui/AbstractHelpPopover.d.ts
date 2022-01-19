import * as React from "react";
import { TooltipPlacement } from "antd/lib/tooltip";
declare type Props = {
    content: React.ReactNode;
    title?: React.ReactNode;
    placement?: TooltipPlacement;
    iconColor?: string;
};
export declare const AbstractHelpPopover: (props: Props) => JSX.Element;
export {};
