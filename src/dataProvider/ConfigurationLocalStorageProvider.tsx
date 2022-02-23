import * as React from "react";
import {PropsWithChildren, useCallback, useState} from "react";
import {Configuration} from "./ConfigurationProvider";
import {ConfigurationValidator} from "./ConfigurationValidator";
import {KeyValueStoreFacade} from "../store/KeyValueStoreFacade";
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

const keyValueStore = KeyValueStoreFacade.createStore("canistergeek__");
const LOCAL_STORAGE__KEY__CONFIGURATION = "key__configuration"

export const ConfigurationLocalStorageProvider = (props: PropsWithChildren<any>) => {
    const [configuration, setConfiguration] = useState<Configuration | undefined>(() => readConfigurationFromLocalStorage())

    const storeConfiguration = useCallback<StoreConfigurationFn>((value: Configuration) => {
        keyValueStore.set(LOCAL_STORAGE__KEY__CONFIGURATION, value)
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
        const parsed: Configuration = keyValueStore.get(LOCAL_STORAGE__KEY__CONFIGURATION) as Configuration;
        const {valid} = ConfigurationValidator.validateConfiguration(parsed)
        if (valid) {
            return parsed
        }
    } catch (e) {
        console.error("Error while restoring value from localstorage", e)
    }
    return undefined
}

