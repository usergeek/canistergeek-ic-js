import * as React from "react";
import {MetricsThresholds} from "./ConfigurationProvider";

export type MetricOutdatedContext = {
    actualTimeMillis: number
}

export type MetricWrapper<V> = {
    value: V
    hasValue: boolean
    label: string | React.ReactNode
    outdatedContext?: MetricOutdatedContext
    colorHex: string | undefined
    percentFromMax?: number
    metricsThresholds?: MetricsThresholds
}