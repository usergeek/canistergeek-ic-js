"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationValidator = void 0;
const lodash_1 = __importDefault(require("lodash"));
const principal_1 = require("@dfinity/principal");
const validateConfiguration = (value) => {
    let validationError = undefined;
    try {
        if (lodash_1.default.isString(value)) {
            value = JSON.parse(value);
        }
        const configuration = value;
        if (configuration.canisters.length > 0) {
            let valid = true;
            const uniqueCanisterCount = lodash_1.default.uniqBy(configuration.canisters, v => v.canisterId).length;
            if (uniqueCanisterCount != configuration.canisters.length) {
                valid = false;
                validationError = new Error("Please provide unique canister Principals");
            }
            else {
                const hasInvalidCanister = lodash_1.default.some(configuration.canisters, canister => {
                    if (lodash_1.default.isString(canister.canisterId) && !lodash_1.default.isEmpty(canister.canisterId)) {
                        try {
                            //validate passed canisterId
                            principal_1.Principal.fromText(canister.canisterId);
                            return false;
                        }
                        catch (e) {
                            //bad canisterId
                        }
                    }
                    return true;
                });
                if (hasInvalidCanister) {
                    valid = false;
                    validationError = new Error("Please provide valid canister Principal");
                }
            }
            return {
                valid: valid,
                error: validationError
            };
        }
        else {
            validationError = new Error("Please provide at least one canister");
        }
    }
    catch (e) {
        validationError = new Error("Please provide valid JSON");
    }
    return {
        valid: false,
        error: validationError
    };
};
exports.ConfigurationValidator = {
    validateConfiguration: validateConfiguration
};
//# sourceMappingURL=ConfigurationValidator.js.map