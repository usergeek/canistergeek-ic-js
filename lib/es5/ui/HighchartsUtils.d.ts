import Highcharts, { PointOptionsObject } from "highcharts";
import { DailyMetricsData, NumericEntity } from "../api/canistergeek.did";
export declare const INCOMPLETE_MARKER: Highcharts.PointMarkerOptionsObject;
export declare type SeriesDataAvailabilityState = "noData" | "complete" | "incomplete";
export declare type ChartHourlyDataSource = {
    timeMillis: bigint;
    values: Array<bigint>;
};
/**
 * Method adds single points to series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * Method mutates *seriesData* parameter
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
export declare const analyzeSeriesDataAvailabilityStateMarkers: (seriesData: Array<PointOptionsObject>, seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState>) => void;
export declare type DailyDataValueProviderFn = (source: DailyMetricsData) => bigint;
export declare type DailyDataWithNumericEntityForValueProviderFn = (dailyMetricsData: DailyMetricsData) => NumericEntity;
export declare type ChartDailyData = Array<PointOptionsObject>;
export declare type ChartHourlyData = Array<PointOptionsObject>;
export interface ChartOptionsParams {
    chartTitle: string;
    seriesName?: string;
    yAxisTitle?: string;
    tooltipValuePostfix?: string;
}
export declare type DailyChartWithNumericEntityDataItem = {
    data: ChartDailyData;
    seriesName?: string;
};
export declare type DailyChartWithNumericEntityData = Array<DailyChartWithNumericEntityDataItem>;
export declare const HighchartsUtils: {
    prepareChartDailyData: (source: Array<DailyMetricsData> | undefined, valueProvider: DailyDataValueProviderFn) => ChartDailyData | undefined;
    prepareChartDailyDataWithNumericEntityFor: (source: Array<DailyMetricsData> | undefined, numericEntityProvider: DailyDataWithNumericEntityForValueProviderFn) => DailyChartWithNumericEntityData | undefined;
    provideCommonOptionsForHourlyChart: (data: Array<ChartHourlyDataSource> | undefined, parameters: ChartOptionsParams) => Highcharts.Options;
    provideCommonOptionsForDailyChart: (data: ChartDailyData | undefined, parameters: ChartOptionsParams) => Highcharts.Options;
    provideCommonOptionsForDailyChartWithNumericEntity: (source: DailyChartWithNumericEntityData | undefined, parameters: ChartOptionsParams) => Highcharts.Options;
};
