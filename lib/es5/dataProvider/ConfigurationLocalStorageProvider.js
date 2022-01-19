"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationLocalStorageProvider = exports.useConfigurationStorageContext = exports.ConfigurationStorageContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const ConfigurationValidator_1 = require("./ConfigurationValidator");
const use_custom_compare_1 = require("use-custom-compare");
const lodash_1 = __importDefault(require("lodash"));
exports.ConfigurationStorageContext = React.createContext(undefined);
const useConfigurationStorageContext = () => {
    const context = React.useContext(exports.ConfigurationStorageContext);
    if (!context) {
        throw new Error("useConfigurationStorageContext must be used within a ConfigurationStorageContext.Provider");
    }
    return context;
};
exports.useConfigurationStorageContext = useConfigurationStorageContext;
const LOCAL_STORAGE__KEY__CONFIGURATION = "canistergeek__key__configuration";
const ConfigurationLocalStorageProvider = (props) => {
    const [configuration, setConfiguration] = (0, react_1.useState)(() => readConfigurationFromLocalStorage());
    const storeConfiguration = (0, react_1.useCallback)((value) => {
        localStorage.setItem(LOCAL_STORAGE__KEY__CONFIGURATION, JSON.stringify(value));
        setConfiguration(value);
    }, []);
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
        configuration: configuration,
        storeConfiguration: storeConfiguration
    }), [
        configuration,
        storeConfiguration
    ], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps[0], nextDeps[0]);
    });
    return React.createElement(exports.ConfigurationStorageContext.Provider, { value: value }, props.children);
};
exports.ConfigurationLocalStorageProvider = ConfigurationLocalStorageProvider;
const readConfigurationFromLocalStorage = () => {
    try {
        const value = localStorage.getItem(LOCAL_STORAGE__KEY__CONFIGURATION);
        if (value) {
            let parsed = JSON.parse(value);
            const valid = ConfigurationValidator_1.ConfigurationValidator.validateConfiguration(parsed);
            if (valid) {
                return parsed;
            }
        }
    }
    catch (e) {
        console.error("Error while restoring value from localstorage", e);
    }
    return undefined;
};
//# sourceMappingURL=ConfigurationLocalStorageProvider.js.map