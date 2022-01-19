import React, {PropsWithChildren} from 'react'
import {Spin} from "antd";
import {SpinSize} from "antd/lib/spin/index";

type Props = {
    size?: SpinSize
    marginTop?: string
}

export const PageLoaderComponent = (props: PropsWithChildren<Props>) => {
    let {size} = props
    if (!size) {
        size = "default"
    }
    return <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: props.marginTop}}>
        <Spin size={size}/>
        {props.children}
    </div>
}