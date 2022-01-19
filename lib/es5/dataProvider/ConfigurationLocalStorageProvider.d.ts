import * as React from "react";
import { PropsWithChildren } from "react";
import { Configuration } from "./ConfigurationProvider";
declare type StoreConfigurationFn = (value: Configuration) => void;
interface Context {
    configuration: Configuration | undefined;
    storeConfiguration: StoreConfigurationFn;
}
export declare const ConfigurationStorageContext: React.Context<Context>;
export declare const useConfigurationStorageContext: () => Context;
export declare const ConfigurationLocalStorageProvider: (props: PropsWithChildren<any>) => JSX.Element;
export {};
