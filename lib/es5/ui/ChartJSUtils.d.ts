import { DailyMetricsData, NumericEntity } from "../api/canistergeek.did";
import { ChartJSChartContext } from "./ChartJSChartContext";
import { ScatterDataPoint, ScriptableContext } from "chart.js";
import { TrendSectionShiftData } from "../dataProvider/PrecalculatedTrendDataProvider";
export declare type SeriesDataAvailabilityState = "noData" | "complete" | "incomplete";
export declare type ChartHourlyDataSource = {
    timeMillis: bigint;
    values: Array<bigint>;
};
export declare type ChartHourlyData = {
    data: Array<ScatterDataPoint>;
    borderColor?: (ctx: ScriptableContext<"line">) => string;
    backgroundColor?: (ctx: ScriptableContext<"line">) => string;
    pointRadius?: (ctx: ScriptableContext<"line">) => number;
};
export declare type ChartDailyData = {
    data: Array<ScatterDataPoint>;
    borderColor?: (ctx: ScriptableContext<"line">) => string;
    backgroundColor?: (ctx: ScriptableContext<"line">) => string;
    pointRadius?: (ctx: ScriptableContext<"line">) => number;
};
export declare type ChartTrendData = {
    data: Array<number | null>;
    borderColor?: (ctx: ScriptableContext<"line">) => string;
    backgroundColor?: (ctx: ScriptableContext<"line">) => string;
    pointRadius?: (ctx: ScriptableContext<"line">) => number;
};
export declare type DailyChartWithNumericEntityDataItem = {
    data: Array<ScatterDataPoint>;
    seriesName?: string;
    borderColor?: (ctx: ScriptableContext<"line">) => string;
    backgroundColor?: (ctx: ScriptableContext<"line">) => string;
    pointRadius?: (ctx: ScriptableContext<"line">) => number;
};
export declare type DailyChartWithNumericEntityData = Array<DailyChartWithNumericEntityDataItem>;
/**
 * Method returns indexes of single points from series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
export declare const analyzeSeriesDataAvailabilityStateMarkers: (seriesData: Array<ScatterDataPoint>, seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState>) => Array<number>;
export declare type DailyDataValueProviderFn = (source: DailyMetricsData) => bigint;
export declare type DailyDataWithNumericEntityForValueProviderFn = (dailyMetricsData: DailyMetricsData) => NumericEntity;
export interface ChartOptionsParams {
    chartTitle?: string;
    seriesName?: string;
    yAxisTitle?: string;
    yAxisMin?: number;
    tooltipValuePrefix?: string;
    tooltipValuePostfix?: string;
}
export declare const ChartJSUtils: {
    prepareChartDailyData: (source: Array<DailyMetricsData> | undefined, valueProvider: DailyDataValueProviderFn) => ChartDailyData | undefined;
    prepareChartDailyDataWithNumericEntityFor: (source: Array<DailyMetricsData> | undefined, numericEntityProvider: DailyDataWithNumericEntityForValueProviderFn) => DailyChartWithNumericEntityData | undefined;
    provideCommonOptionsForHourlyChart: (data: Array<ChartHourlyDataSource> | undefined, parameters: ChartOptionsParams) => ChartJSChartContext | undefined;
    provideCommonOptionsForDailyChart: (data: ChartDailyData | undefined, parameters: ChartOptionsParams) => ChartJSChartContext | undefined;
    provideCommonOptionsForDailyChartWithNumericEntity: (source: DailyChartWithNumericEntityData | undefined, parameters: ChartOptionsParams) => ChartJSChartContext | undefined;
    provideCommonOptionsForTrendShiftDataChart: (source: Array<TrendSectionShiftData> | undefined, parameters: ChartOptionsParams) => ChartJSChartContext | undefined;
};
