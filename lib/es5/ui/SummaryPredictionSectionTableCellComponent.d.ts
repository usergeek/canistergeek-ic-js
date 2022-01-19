/// <reference types="react" />
import { MetricsData } from "../dataProvider/PrecalculatedPredictionDataProvider";
declare type Props<V> = {
    metric: "cycles" | "memory";
    data: MetricsData<V> | undefined;
    differenceTitlePostfix: string;
};
export declare function SummaryPredictionSectionTableCellComponent<V>(props: Props<V>): JSX.Element;
export {};
