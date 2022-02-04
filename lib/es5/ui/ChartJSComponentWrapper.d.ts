/// <reference types="react" />
import { ChartJSChartComponentSupplier } from "./ChartJSChartContext";
import "./chartJSComponentWrapper.css";
declare type Props = {
    supplier: ChartJSChartComponentSupplier;
    inProgress: boolean;
    [key: string]: any;
};
export declare const ChartJSComponentWrapper: ({ supplier, inProgress, chartIdentifier }: Props) => JSX.Element;
export {};
