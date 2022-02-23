import * as React from "react";
import {PropsWithChildren, useCallback, useMemo, useState} from "react";
import queryString from "query-string";
import {generatePath} from "react-router-dom";

export type MetricsSection = "summary" | string
export type LogMessagesSection = "summary" | "realtime" | "history"

type PathToMetricsSectionFn = (section: MetricsSection) => string
type PathToLogMessagesSectionFn = (section: LogMessagesSection) => string

interface Context {
    configPath: string
    basePath: string
    metricsPathRoot: string
    metricsPath: string
    logMessagesPathRoot: string
    logMessagesPath: string
    githubMotokoLibraryURL: string
    githubMotokoLibraryLimitAccessURL: string
    githubRustLibraryURL: string
    githubRustLibraryLimitAccessURL: string
    pathToMetricsSection: PathToMetricsSectionFn
    pathToLogMessagesSection: PathToLogMessagesSectionFn
}

export const URLPathContext = React.createContext<Context | undefined>(undefined);
export const useURLPathContext = () => {
    const context = React.useContext<Context | undefined>(URLPathContext);
    if (!context) {
        throw new Error("useURLPathContext must be used within a URLPathContext.Provider")
    }
    return context;
}

type Props = {
    configPath: string
    basePath: string
    githubMotokoLibraryURL: string
    githubMotokoLibraryLimitAccessURL: string
    githubRustLibraryURL: string
    githubRustLibraryLimitAccessURL: string
}

export const URLPathProvider = (props: PropsWithChildren<Props>) => {
    const [configPath] = useState<string>(props.configPath)
    const [basePath] = useState<string>(props.basePath)
    const [metricsPathRoot] = useState<string>(`${props.basePath}/metrics`)
    const [metricsPath] = useState<string>(`${metricsPathRoot}/:canisterId`)
    const [logMessagesPathRoot] = useState<string>(`${props.basePath}/logMessages`)
    const [logMessagesPath] = useState<string>(`${logMessagesPathRoot}/:section`)

    const pathToMetricsSection = useCallback<PathToMetricsSectionFn>((section: MetricsSection) => {
        return generatePath(queryString.stringifyUrl({url: metricsPath}), {canisterId: section})
    }, [basePath])

    const pathToLogMessagesSection = useCallback<PathToLogMessagesSectionFn>((section: LogMessagesSection) => {
        return generatePath(queryString.stringifyUrl({url: logMessagesPath}), {section: section})
    }, [basePath])

    const value = useMemo<Context>(() => ({
        configPath: configPath,
        basePath: basePath,
        metricsPathRoot: metricsPathRoot,
        metricsPath: metricsPath,
        logMessagesPathRoot: logMessagesPathRoot,
        logMessagesPath: logMessagesPath,
        pathToMetricsSection: pathToMetricsSection,
        pathToLogMessagesSection: pathToLogMessagesSection,
        githubMotokoLibraryURL: props.githubMotokoLibraryURL,
        githubMotokoLibraryLimitAccessURL: props.githubMotokoLibraryLimitAccessURL,
        githubRustLibraryURL: props.githubRustLibraryURL,
        githubRustLibraryLimitAccessURL: props.githubRustLibraryLimitAccessURL,
    }), [
        configPath,
        basePath,
        metricsPathRoot,
        metricsPath,
        logMessagesPathRoot,
        logMessagesPath,
        pathToMetricsSection,
        pathToLogMessagesSection,
        props.githubMotokoLibraryURL,
        props.githubMotokoLibraryLimitAccessURL,
        props.githubRustLibraryURL,
        props.githubRustLibraryLimitAccessURL,
    ])

    return <URLPathContext.Provider value={value}>
        {props.children}
    </URLPathContext.Provider>
}