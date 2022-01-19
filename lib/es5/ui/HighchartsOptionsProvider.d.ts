import * as React from "react";
import { PropsWithChildren } from "react";
import Highcharts from "highcharts";
export declare type StateError = {
    error?: Error;
    isError: boolean;
};
export declare type HighchartsOptionsState = {
    isError: boolean;
    error?: Error;
    options: Highcharts.Options;
};
export declare type Context = {
    state: HighchartsOptionsState;
};
export declare const HighchartsOptionsContext: React.Context<Context>;
declare type HighchartsOptionsProviderFn<D, P> = (data: D, parameters: P) => Highcharts.Options;
declare type StateDataTransformFn<D> = (data: D) => any;
declare type Props<D, P> = {
    error?: StateError;
    data: D;
    parameters: P;
    highchartsOptionsProviderFn: HighchartsOptionsProviderFn<D, P>;
    stateDataTransformFn?: StateDataTransformFn<D>;
};
export declare function HighchartsOptionsProvider<D, P>(props: PropsWithChildren<Props<D, P>>): JSX.Element;
export {};
