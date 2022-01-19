/// <reference types="react" />
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
declare type Props = {
    value: string;
    onChange: (value: string) => void;
    height: number;
};
export declare const ConfigurationTextarea: (props: Props) => JSX.Element;
export {};
