import * as React from "react";
import {COLOR_GRAY_HEX, NO_OBJECT_VALUE_LABEL} from "../dataProvider/Constants";

export const CommonNoDataLabel = () => {
    return <span style={{color: COLOR_GRAY_HEX}}>{NO_OBJECT_VALUE_LABEL}</span>
}