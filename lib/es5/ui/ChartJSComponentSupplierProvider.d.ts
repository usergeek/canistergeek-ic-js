import * as React from "react";
import { PropsWithChildren } from "react";
import { ChartJSChartComponentSupplier, ChartJSChartContext } from "./ChartJSChartContext";
export declare type StateError = {
    error?: Error;
    isError: boolean;
};
export declare type Context = {
    state: ChartJSChartComponentSupplier;
};
export declare const ChartJSComponentSupplierContext: React.Context<Context>;
declare type ChartJSChartContextProviderFn<D, P> = (data: D, parameters: P) => ChartJSChartContext | undefined;
declare type StateDataTransformFn<D> = (data: D) => any;
declare type Props<D, P> = {
    error?: StateError;
    data: D;
    parameters: P;
    chartContextProviderFn: ChartJSChartContextProviderFn<D, P>;
    stateDataTransformFn?: StateDataTransformFn<D>;
};
export declare function ChartJSComponentSupplierProvider<D, P>(props: PropsWithChildren<Props<D, P>>): JSX.Element;
export {};
