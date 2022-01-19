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
exports.ConfigurationProvider = exports.useConfigurationContext = exports.ConfigurationContext = void 0;
const React = __importStar(require("react"));
const use_custom_compare_1 = require("use-custom-compare");
const lodash_1 = __importDefault(require("lodash"));
const initialContextValue = {
    configuration: {
        canisters: []
    },
};
exports.ConfigurationContext = React.createContext(undefined);
const useConfigurationContext = () => {
    const context = React.useContext(exports.ConfigurationContext);
    if (!context) {
        throw new Error("useConfigurationContext must be used within a ConfigurationContext.Provider");
    }
    return context;
};
exports.useConfigurationContext = useConfigurationContext;
const ConfigurationProvider = (props) => {
    const _configuration = props.configuration || initialContextValue.configuration;
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
        configuration: _configuration,
    }), [
        _configuration,
    ], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    return React.createElement(exports.ConfigurationContext.Provider, { value: value }, props.children);
};
exports.ConfigurationProvider = ConfigurationProvider;
//# sourceMappingURL=ConfigurationProvider.js.map