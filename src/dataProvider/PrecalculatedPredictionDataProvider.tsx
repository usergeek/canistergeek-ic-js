import * as React from "react";
import {PropsWithChildren, useState} from "react";
import {useCustomCompareEffect, useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"
import {CanisterId, useConfigurationContext} from "./ConfigurationProvider";
import {useDataContext} from "./DataProvider";
import {DateDifference} from "./DateUtils";
import {PrecalculatedPredictionDataProviderCalculator} from "./PrecalculatedPredictionDataProviderCalculator";
import {MetricWrapper} from "./PrecalculatedDataProvider";

export type PredictionInterval = "hour" | "day"

export type DateData = {
    fromMillis: number
    toMillis: number
    difference: DateDifference
}

export type ValueData = {
    lastValue: number
    difference: number
}

export type MetricsData<V> = {
    predictionInterval: PredictionInterval
    date: DateData
    data: ValueData
    metricWrapper?: MetricWrapper<V>
}

export type PredictionMetricsData = {
    cycles: MetricsData<number>
    memory: MetricsData<number>
}

export type CanisterPredictionData = {
    canisterId: string
    predictionData: PredictionMetricsData
}

export type PrecalculatedData = { [key: CanisterId]: CanisterPredictionData }

export interface Context {
    precalculatedData: PrecalculatedData
}

export const PrecalculatedPredictionDataContext = React.createContext<Context | undefined>(undefined);
export const usePrecalculatedPredictionDataContext = () => {
    const context = React.useContext<Context | undefined>(PrecalculatedPredictionDataContext);
    if (!context) {
        throw new Error("usePrecalculatedPredictionDataContext must be used within a PrecalculatedPredictionDataContext.Provider")
    }
    return context;
}

export const PrecalculatedPredictionDataProvider = (props: PropsWithChildren<any>) => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const [precalculatedData, setPrecalculatedData] = useState<PrecalculatedData>({})

    useCustomCompareEffect(() => {
        setPrecalculatedData(PrecalculatedPredictionDataProviderCalculator.getPrecalculatedData(dataContext.dataHourly, configurationContext.configuration))
    }, [dataContext.dataHourly, configurationContext.configuration], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })

    const value = useCustomCompareMemo<Context, [PrecalculatedData]>(() => ({
        precalculatedData: precalculatedData
    }), [precalculatedData], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <PrecalculatedPredictionDataContext.Provider value={value}>
        {props.children}
    </PrecalculatedPredictionDataContext.Provider>
}