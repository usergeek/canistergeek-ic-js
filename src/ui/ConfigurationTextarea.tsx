import * as React from "react";
import {useCallback} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

type Props = {
    value: string,
    onChange: (value: string) => void
    height: number
}

export const ConfigurationTextarea = (props: Props) => {

    const onChange = useCallback((value: string) => {
        props.onChange && props.onChange(value)
    }, [])

    return <AceEditor
        value={props.value}
        onChange={onChange}
        height={`${props.height}px`}
        width={"100%"}
        mode="json"
        theme="github"
        showPrintMargin={false}
        editorProps={{$blockScrolling: true}}
        setOptions={{
            useWorker: false
        }}
    />
}