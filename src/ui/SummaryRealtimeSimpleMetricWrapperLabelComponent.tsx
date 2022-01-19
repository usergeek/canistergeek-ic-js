import * as React from "react";
import {MetricWrapper} from "../dataProvider/PrecalculatedDataProvider";
import {DateUtils} from "../dataProvider/DateUtils";
import {COLOR_GRAY_HEX, NO_OBJECT_VALUE_LABEL} from "../dataProvider/Constants";

type SimpleMetricLabelComponentProps<V> = {
    metricWrapper?: MetricWrapper<V>
}

export function SummaryRealtimeSimpleMetricWrapperLabelComponent<V>(props: SimpleMetricLabelComponentProps<V>) {
    const value = props.metricWrapper;
    if (value?.hasValue) {
        let outdatedContent: React.ReactNode = null
        if (value?.outdatedContext) {
            const differencesBetweenToMillis = DateUtils.Diff.getDifferenceBetweenToMillis(value?.outdatedContext.actualTimeMillis, new Date().getTime());
            const diffString = DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis)
            outdatedContent = <span style={{fontSize: "0.8em", color: "darkgray"}}>({diffString} ago)</span>
        }
        return <span style={{color: value?.colorHex}}>{value?.label} {outdatedContent}</span>
    }
    return <span style={{color: COLOR_GRAY_HEX}}>{NO_OBJECT_VALUE_LABEL}</span>
}