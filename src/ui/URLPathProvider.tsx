import * as React from "react";
import {PropsWithChildren, useCallback, useMemo, useState} from "react";
import queryString from "query-string";
import {generatePath} from "react-router-dom";

export type Section = "summary" | string

type PathToSectionFn = (section: Section) => string

interface Context {
    configPath: string
    basePathRoot: string
    basePath: string
    pathToSection: PathToSectionFn
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
}

export const URLPathProvider = (props: PropsWithChildren<Props>) => {
    const [configPath] = useState<string>(props.configPath)
    const [basePathRoot] = useState<string>(props.basePath)
    const [basePath] = useState<string>(`${props.basePath}/:canisterId`)

    const pathToSection = useCallback<PathToSectionFn>((section: Section) => {
        return generatePath(queryString.stringifyUrl({url: basePath}), {canisterId: section})
    }, [basePath])

    const value = useMemo<Context>(() => ({
        configPath: configPath,
        basePathRoot: basePathRoot,
        basePath: basePath,
        pathToSection: pathToSection
    }), [
        configPath,
        basePathRoot,
        basePath,
        pathToSection
    ])

    return <URLPathContext.Provider value={value}>
        {props.children}
    </URLPathContext.Provider>
}