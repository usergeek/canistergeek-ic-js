import {Configuration} from "./ConfigurationProvider";
import _ from "lodash"
import {Principal} from "@dfinity/principal";

const validateConfiguration = (value: any): boolean => {
    try {
        if (_.isString(value)) {
            value = JSON.parse(value)
        }
        const configuration: Configuration = value as Configuration
        if (configuration.canisters.length > 0) {
            const hasInvalidCanister = _.some(configuration.canisters, canister => {
                if (_.isString(canister.canisterId) && !_.isEmpty(canister.canisterId)) {
                    try {
                        //validate passed canisterId
                        Principal.fromText(canister.canisterId)
                        return false
                    } catch (e) {
                        //bad canisterId
                    }
                }
                return true
            })
            return !hasInvalidCanister
        }
    } catch (e) {
    }
    return false
}

export const ConfigurationValidator = {
    validateConfiguration: validateConfiguration
}