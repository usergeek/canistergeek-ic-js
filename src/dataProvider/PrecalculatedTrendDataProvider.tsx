import * as React from "react";
import {PropsWithChildren, useState} from "react";
import {useCustomCompareEffect, useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"
import {CanisterId} from "./ConfigurationProvider";
import {useDataContext} from "./DataProvider";
import {PrecalculatedTrendDataProviderCalculator} from "./PrecalculatedTrendDataProviderCalculator";

export type TrendSection24HoursInterval = {
    fromMillis: number
    toMillis: number
}

export type TrendSection24HoursData = {
    interval: TrendSection24HoursInterval
    updateCalls: number
    cyclesDifference: number
    cyclesDifferenceInDollars: number
    memoryDifference: number
    heapMemoryDifference: number
}

export type TrendSectionShiftData = {
    interval: TrendSection24HoursInterval
    value: number | undefined
    numberOfShiftsBy24Hours: number
}

export type TrendSectionShiftsData = {
    updateCalls: Array<TrendSectionShiftData>
    cycles: {
        difference: Array<TrendSectionShiftData>
        differenceInDollars: Array<TrendSectionShiftData>
    }
    memoryDifference: Array<TrendSectionShiftData>,
    heapMemoryDifference: Array<TrendSectionShiftData>,
}

export type SummaryPageTrendSectionData = {
    canisterId: string
    shiftsData: TrendSectionShiftsData
}

export type PrecalculatedData = { [key: CanisterId]: SummaryPageTrendSectionData }

export interface Context {
    precalculatedData: PrecalculatedData
}

export const PrecalculatedTrendDataContext = React.createContext<Context | undefined>(undefined);
export const usePrecalculatedTrendDataContext = () => {
    const context = React.useContext<Context | undefined>(PrecalculatedTrendDataContext);
    if (!context) {
        throw new Error("usePrecalculatedTrendDataContext must be used within a PrecalculatedTrendDataContext.Provider")
    }
    return context;
}

export const PrecalculatedTrendDataProvider = (props: PropsWithChildren<any>) => {
    const dataContext = useDataContext();

    const [precalculatedData, setPrecalculatedData] = useState<PrecalculatedData>({})

    useCustomCompareEffect(() => {
        setPrecalculatedData(PrecalculatedTrendDataProviderCalculator.getPrecalculatedData(dataContext.dataHourly))
    }, [dataContext.dataHourly], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })

    const value = useCustomCompareMemo<Context, [PrecalculatedData]>(() => ({
        precalculatedData: precalculatedData
    }), [precalculatedData], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <PrecalculatedTrendDataContext.Provider value={value}>
        {props.children}
    </PrecalculatedTrendDataContext.Provider>
}