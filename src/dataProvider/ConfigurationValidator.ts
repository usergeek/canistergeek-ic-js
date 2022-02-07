import {Canister, Configuration} from "./ConfigurationProvider";
import _ from "lodash"
import {Principal} from "@dfinity/principal";

export type ConfigurationValidationResult = { valid: boolean, error?: Error }
const validateConfiguration = (value: any): ConfigurationValidationResult => {
    let validationError: Error | undefined = undefined
    try {
        if (_.isString(value)) {
            value = JSON.parse(value)
        }
        const configuration: Configuration = value as Configuration
        if (configuration.canisters.length > 0) {
            let valid: boolean = true
            const uniqueCanisterCount = _.uniqBy(configuration.canisters, v => v.canisterId).length
            if (uniqueCanisterCount != configuration.canisters.length) {
                valid = false
                validationError = new Error("Please provide unique canister Principals")
            } else {
                const hasInvalidCanister: boolean = _.some<Canister>(configuration.canisters, canister => {
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
                if (hasInvalidCanister) {
                    valid = false
                    validationError = new Error("Please provide valid canister Principal")
                }
            }
            return {
                valid: valid,
                error: validationError
            }
        } else {
            validationError = new Error("Please provide at least one canister")
        }
    } catch (e) {
        validationError = new Error("Please provide valid JSON")
    }
    return {
        valid: false,
        error: validationError
    }
}

export const ConfigurationValidator = {
    validateConfiguration: validateConfiguration
}