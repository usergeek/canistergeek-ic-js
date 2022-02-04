import * as React from "react";
import 'chartjs-adapter-moment';
import { ChartJSChartContext } from "./ChartJSChartContext";
export declare const ColorsDictionary: {
    blue: string;
    black: string;
    lime: string;
    orange: string;
    darkblue: string;
    pink: string;
    yellow: string;
    green: string;
    red: string;
    lightblue: string;
};
export declare const getColorByIndex: (index: number) => string;
declare type Props = {
    chartContext: ChartJSChartContext;
    chartIdentifier?: string;
    cssProps?: React.CSSProperties;
};
export declare const ChartJSWithOptionsComponent: React.MemoExoticComponent<({ chartContext, cssProps }: Props) => JSX.Element>;
export {};
