import * as React from "react";
import {PropsWithChildren} from "react";
import {useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"

export type CanisterId = string
export type CanisterMetricsSource = "canister" | "blackhole"

export type Canister = {
    canisterId: CanisterId
    name?: string,
    metricsSource?: Array<CanisterMetricsSource>
}

type ThresholdStep = {
    value: number,
    colorHex: string
}

type BaseThreshold = {
    colorHex: string
}

export type MetricsFormat = "none" | "memoryShort" | "cyclesShort"

export type MetricsThresholds = {
    mode?: "absolute"
    base: BaseThreshold
    steps?: Array<ThresholdStep>
}

type ConfigurationMetricsCycles = {
    metricsFormat?: MetricsFormat
    thresholds?: MetricsThresholds
    predictionThresholds?: MetricsThresholds
}

export type ConfigurationMetricsMemory = {
    metricsFormat?: MetricsFormat
    thresholds?: MetricsThresholds
    predictionThresholds?: MetricsThresholds
    limitations?: {
        hourly?: {
            maxValue?: number
            percentFromMaxMinValue?: number
        }
    }
}

export type ConfigurationMetrics = {
    cycles?: ConfigurationMetricsCycles
    memory?: ConfigurationMetricsMemory
    heapMemory?: ConfigurationMetricsMemory
}

export type Configuration = {
    canisters: Array<Canister>
    metrics?: ConfigurationMetrics,
}

interface Context {
    configuration: Configuration
}

const initialContextValue: Context = {
    configuration: {
        canisters: []
    },
}

export const ConfigurationContext = React.createContext<Context | undefined>(undefined);
export const useConfigurationContext = () => {
    const context = React.useContext<Context | undefined>(ConfigurationContext);
    if (!context) {
        throw new Error("useConfigurationContext must be used within a ConfigurationContext.Provider")
    }
    return context;
}

type Props = {
    configuration?: Configuration
}

export const ConfigurationProvider = (props: PropsWithChildren<Props>) => {
    const _configuration = props.configuration || initialContextValue.configuration

    const value = useCustomCompareMemo<Context, [Configuration]>(() => ({
        configuration: _configuration,
    }), [
        _configuration,
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <ConfigurationContext.Provider value={value}>
        {props.children}
    </ConfigurationContext.Provider>
}