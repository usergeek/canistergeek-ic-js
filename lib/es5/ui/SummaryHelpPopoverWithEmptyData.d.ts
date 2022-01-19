import * as React from "react";
import { MetricsData } from "../dataProvider/PrecalculatedPredictionDataProvider";
declare type Props<V> = {
    data: MetricsData<V>;
    differenceTitlePostfix: string;
    emptyDataLabel: string | React.ReactNode;
    iconColor?: string;
};
export declare function SummaryHelpPopoverWithEmptyData<V>(props: Props<V>): JSX.Element;
export {};
