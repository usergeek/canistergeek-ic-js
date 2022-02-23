import { ChartData, ChartOptions, ChartType, DefaultDataPoint, ScatterDataPoint } from "chart.js";
import { CGError } from "../dataProvider/Commons";
export declare type ChartJSChartCtx<TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown> = {
    options: ChartOptions<TType>;
    data: ChartData<TType, TData, TLabel>;
};
export declare type ChartJSChartContextLine = ChartJSChartCtx<"line", Array<ScatterDataPoint | number | null>, string>;
export declare type ChartJSChartContext = ChartJSChartContextLine;
export declare type ChartJSChartComponentSupplier = CGError & {
    chartContext: ChartJSChartContext | undefined;
};
