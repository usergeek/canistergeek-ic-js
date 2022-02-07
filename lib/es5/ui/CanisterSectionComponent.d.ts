/// <reference types="react" />
import { CanisterMetricsSource } from "../dataProvider/ConfigurationProvider";
declare type Props = {
    canisterId: string;
};
declare type PropsWithMetricsSource = {
    metricsSource: Array<CanisterMetricsSource> | undefined;
};
export declare const CanisterSectionComponentCanisterSource: (props: Props & PropsWithMetricsSource) => JSX.Element;
export declare const CanisterSectionComponentBlackholeSource: (props: Props & PropsWithMetricsSource) => JSX.Element;
export declare const CanisterSectionComponent: (props: Props) => JSX.Element;
export {};
