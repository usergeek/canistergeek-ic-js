import * as React from "react";
import { MetricsData } from "../dataProvider/PrecalculatedPredictionDataProvider";
declare type Props<V> = {
    data: MetricsData<V>;
    differenceTitlePostfix: string;
    predictionLabel: string | React.ReactNode;
};
export declare function SummaryHelpPopoverWithData<V>(props: Props<V>): JSX.Element;
export {};
