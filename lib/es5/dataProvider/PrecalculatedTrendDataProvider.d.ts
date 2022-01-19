import * as React from "react";
import { PropsWithChildren } from "react";
import { CanisterId } from "./ConfigurationProvider";
export declare type TrendSection24HoursInterval = {
    fromMillis: number;
    toMillis: number;
};
export declare type TrendSection24HoursData = {
    interval: TrendSection24HoursInterval;
    updateCalls: number;
    cyclesDifference: number;
    cyclesDifferenceInDollars: number;
    memoryDifference: number;
    heapMemoryDifference: number;
};
export declare type TrendSectionShiftData = {
    interval: TrendSection24HoursInterval;
    value: number | undefined;
    numberOfShiftsBy24Hours: number;
};
export declare type TrendSectionShiftsData = {
    updateCalls: Array<TrendSectionShiftData>;
    cycles: {
        difference: Array<TrendSectionShiftData>;
        differenceInDollars: Array<TrendSectionShiftData>;
    };
    memoryDifference: Array<TrendSectionShiftData>;
    heapMemoryDifference: Array<TrendSectionShiftData>;
};
export declare type SummaryPageTrendSectionData = {
    canisterId: string;
    shiftsData: TrendSectionShiftsData;
};
export declare type PrecalculatedData = {
    [key: CanisterId]: SummaryPageTrendSectionData;
};
export interface Context {
    precalculatedData: PrecalculatedData;
}
export declare const PrecalculatedTrendDataContext: React.Context<Context>;
export declare const usePrecalculatedTrendDataContext: () => Context;
export declare const PrecalculatedTrendDataProvider: (props: PropsWithChildren<any>) => JSX.Element;
