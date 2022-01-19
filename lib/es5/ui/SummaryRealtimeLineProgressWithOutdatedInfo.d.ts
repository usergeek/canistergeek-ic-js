/// <reference types="react" />
import { MetricWrapper } from "../dataProvider/PrecalculatedDataProvider";
export declare type ProgressProps<V> = {
    metricWrapper: MetricWrapper<V> | undefined;
};
export declare function SummaryRealtimeLineProgressWithOutdatedInfo<V>(props: ProgressProps<V>): JSX.Element;
