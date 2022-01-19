"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationValidator = void 0;
const lodash_1 = __importDefault(require("lodash"));
const principal_1 = require("@dfinity/principal");
const validateConfiguration = (value) => {
    try {
        if (lodash_1.default.isString(value)) {
            value = JSON.parse(value);
        }
        const configuration = value;
        if (configuration.canisters.length > 0) {
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
            return !hasInvalidCanister;
        }
    }
    catch (e) {
    }
    return false;
};
exports.ConfigurationValidator = {
    validateConfiguration: validateConfiguration
};
//# sourceMappingURL=ConfigurationValidator.js.map