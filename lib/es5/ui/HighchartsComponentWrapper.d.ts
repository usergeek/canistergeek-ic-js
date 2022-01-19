/// <reference types="react" />
import { HighchartsOptionsState } from "./HighchartsOptionsProvider";
declare type Props = {
    highchartsOptionsState: HighchartsOptionsState;
    inProgress: boolean;
    chartIdentifier?: string;
};
export declare const HighchartsComponentWrapper: ({ highchartsOptionsState, inProgress, chartIdentifier }: Props) => JSX.Element;
export {};
