import * as React from "react";
import {PropsWithChildren, useCallback, useState} from "react";
import {Configuration} from "./ConfigurationProvider";
import {ConfigurationValidator} from "./ConfigurationValidator";
import {useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash";

type StoreConfigurationFn = (value: Configuration) => void

interface Context {
    configuration: Configuration | undefined
    storeConfiguration: StoreConfigurationFn
}

export const ConfigurationStorageContext = React.createContext<Context | undefined>(undefined);
export const useConfigurationStorageContext = () => {
    const context = React.useContext<Context | undefined>(ConfigurationStorageContext);
    if (!context) {
        throw new Error("useConfigurationStorageContext must be used within a ConfigurationStorageContext.Provider")
    }
    return context;
}

const LOCAL_STORAGE__KEY__CONFIGURATION = "canistergeek__key__configuration"

export const ConfigurationLocalStorageProvider = (props: PropsWithChildren<any>) => {
    const [configuration, setConfiguration] = useState<Configuration | undefined>(() => readConfigurationFromLocalStorage())

    const storeConfiguration = useCallback<StoreConfigurationFn>((value: Configuration) => {
        localStorage.setItem(LOCAL_STORAGE__KEY__CONFIGURATION, JSON.stringify(value))
        setConfiguration(value)
    }, [])

    const value = useCustomCompareMemo<Context, [Configuration | undefined, StoreConfigurationFn]>(() => ({
        configuration: configuration,
        storeConfiguration: storeConfiguration
    }), [
        configuration,
        storeConfiguration
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps[0], nextDeps[0])
    })

    return <ConfigurationStorageContext.Provider value={value}>
        {props.children}
    </ConfigurationStorageContext.Provider>
}

const readConfigurationFromLocalStorage = (): Configuration | undefined => {
    try {
        const value = localStorage.getItem(LOCAL_STORAGE__KEY__CONFIGURATION);
        if (value) {
            let parsed: Configuration = JSON.parse(value) as Configuration;
            const valid = ConfigurationValidator.validateConfiguration(parsed)
            if (valid) {
                return parsed
            }
        }
    } catch (e) {
        console.error("Error while restoring value from localstorage", e)
    }
    return undefined
}

