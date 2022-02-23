import * as React from "react";
import { PropsWithChildren } from "react";
import { ChartJSChartComponentSupplier, ChartJSChartContext } from "./ChartJSChartContext";
import { CGError } from "../dataProvider/Commons";
export declare type Context = {
    state: ChartJSChartComponentSupplier;
};
export declare const ChartJSComponentSupplierContext: React.Context<Context>;
declare type ChartJSChartContextProviderFn<D, P> = (data: D, parameters: P) => ChartJSChartContext | undefined;
declare type StateDataTransformFn<D> = (data: D) => any;
declare type Props<D, P> = {
    error?: CGError;
    data: D;
    parameters: P;
    chartContextProviderFn: ChartJSChartContextProviderFn<D, P>;
    stateDataTransformFn?: StateDataTransformFn<D>;
};
export declare function ChartJSComponentSupplierProvider<D, P>(props: PropsWithChildren<Props<D, P>>): JSX.Element;
export {};
