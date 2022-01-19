import * as React from "react";
import {Alert} from "antd";

type Props = {
    type: 'success' | 'info' | 'warning' | 'error',
    message: React.ReactElement,
    description: React.ReactElement,
}

export const PageContentAlert = (props: Props) => {
    return <Alert type={props.type} message={props.message} description={props.description} className="pageContentAlert"/>
}