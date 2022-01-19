import * as React from "react";
import {PropsWithChildren, useState} from "react";
import {useCustomCompareEffect, useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"
import {MetricWrapper} from "./PrecalculatedDataProvider";
import {useDataContext} from "./DataProvider";
import {CanisterId, useConfigurationContext} from "./ConfigurationProvider";
import {PrecalculatedRealtimeDataProviderCalculator} from "./PrecalculatedRealtimeDataProviderCalculator";

export type SummaryPageRealtimeSectionData = {
    canisterId: string
    cycles: MetricWrapper<number>
    memory: MetricWrapper<number>
    heapMemory: MetricWrapper<number>
}

export type PrecalculatedData = { [key: CanisterId]: SummaryPageRealtimeSectionData }

export interface Context {
    precalculatedData: PrecalculatedData
}

export const PrecalculatedRealtimeDataContext = React.createContext<Context | undefined>(undefined);
export const usePrecalculatedRealtimeDataContext = () => {
    const context = React.useContext<Context | undefined>(PrecalculatedRealtimeDataContext);
    if (!context) {
        throw new Error("usePrecalculatedRealtimeDataContext must be used within a PrecalculatedRealtimeDataContext.Provider")
    }
    return context;
}

export const PrecalculatedRealtimeDataProvider = (props: PropsWithChildren<any>) => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const [precalculatedData, setPrecalculatedData] = useState<PrecalculatedData>({})

    useCustomCompareEffect(() => {
        setPrecalculatedData(PrecalculatedRealtimeDataProviderCalculator.getPrecalculatedData(dataContext.dataHourly, configurationContext.configuration))
    }, [dataContext.dataHourly, configurationContext.configuration], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })

    const value = useCustomCompareMemo<Context, [PrecalculatedData]>(() => ({
        precalculatedData: precalculatedData
    }), [precalculatedData], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <PrecalculatedRealtimeDataContext.Provider value={value}>
        {props.children}
    </PrecalculatedRealtimeDataContext.Provider>
}
