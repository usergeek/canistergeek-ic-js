/// <reference types="react" />
import { MetricWrapper } from "../dataProvider/PrecalculatedDataProvider";
declare type SimpleMetricLabelComponentProps<V> = {
    metricWrapper?: MetricWrapper<V>;
};
export declare function SummaryRealtimeSimpleMetricWrapperLabelComponent<V>(props: SimpleMetricLabelComponentProps<V>): JSX.Element;
export {};
