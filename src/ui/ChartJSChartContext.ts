import {ChartData, ChartOptions, ChartType, DefaultDataPoint, ScatterDataPoint} from "chart.js";

export type ChartJSChartCtx<TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown> = {
    options: ChartOptions<TType>
    data: ChartData<TType, TData, TLabel>
}

export type ChartJSChartContextLine = ChartJSChartCtx<"line", Array<ScatterDataPoint | number | null>, string>
export type ChartJSChartContext = ChartJSChartContextLine

export type ChartJSChartComponentSupplier = {
    chartContext: ChartJSChartContext | undefined
    isError: boolean
    error?: Error
}