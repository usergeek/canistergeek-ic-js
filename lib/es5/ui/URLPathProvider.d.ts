import * as React from "react";
import { PropsWithChildren } from "react";
export declare type MetricsSection = "summary" | string;
export declare type LogMessagesSection = "summary" | "realtime" | "history";
declare type PathToMetricsSectionFn = (section: MetricsSection) => string;
declare type PathToLogMessagesSectionFn = (section: LogMessagesSection) => string;
interface Context {
    configPath: string;
    basePath: string;
    metricsPathRoot: string;
    metricsPath: string;
    logMessagesPathRoot: string;
    logMessagesPath: string;
    githubMotokoLibraryURL: string;
    githubMotokoLibraryLimitAccessURL: string;
    githubRustLibraryURL: string;
    githubRustLibraryLimitAccessURL: string;
    pathToMetricsSection: PathToMetricsSectionFn;
    pathToLogMessagesSection: PathToLogMessagesSectionFn;
}
export declare const URLPathContext: React.Context<Context>;
export declare const useURLPathContext: () => Context;
declare type Props = {
    configPath: string;
    basePath: string;
    githubMotokoLibraryURL: string;
    githubMotokoLibraryLimitAccessURL: string;
    githubRustLibraryURL: string;
    githubRustLibraryLimitAccessURL: string;
};
export declare const URLPathProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export {};
