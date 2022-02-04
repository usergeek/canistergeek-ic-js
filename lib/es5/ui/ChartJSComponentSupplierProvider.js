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
exports.ChartJSComponentSupplierProvider = exports.ChartJSComponentSupplierContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const use_custom_compare_1 = require("use-custom-compare");
const lodash_1 = __importDefault(require("lodash"));
const initialState = {
    isError: false,
    error: undefined,
    chartContext: undefined,
};
const defaultContextValue = { state: initialState };
exports.ChartJSComponentSupplierContext = React.createContext(defaultContextValue);
function ChartJSComponentSupplierProvider(props) {
    (0, use_custom_compare_1.useCustomCompareEffect)(() => {
        var _a;
        // }
        try {
            if ((_a = props.error) === null || _a === void 0 ? void 0 : _a.isError) {
                setState({
                    isError: props.error.isError,
                    error: props.error.error,
                    chartContext: undefined,
                });
            }
            else {
                const data = props.data;
                if (data) {
                    const parameters = lodash_1.default.isNil(props.stateDataTransformFn) ? data : props.stateDataTransformFn(data);
                    const chartContext = props.chartContextProviderFn(parameters, props.parameters);
                    setState({
                        isError: false,
                        error: undefined,
                        chartContext: chartContext,
                    });
                }
                else {
                    setState({
                        isError: false,
                        error: undefined,
                        chartContext: undefined,
                    });
                }
            }
        }
        catch (e) {
            console.error("ChartJSComponentSupplierProvider calculation failed:", e);
            setState({
                isError: true,
                error: new Error("temporarilyUnavailable"),
                chartContext: undefined,
            });
        }
    }, [props.error, props.data, props.parameters, props.chartContextProviderFn, props.stateDataTransformFn], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    const [state, setState] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), lodash_1.default.cloneDeep(initialState));
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
        state,
    }), [
        state,
    ], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    return React.createElement(exports.ChartJSComponentSupplierContext.Provider, { value: value }, props.children);
}
exports.ChartJSComponentSupplierProvider = ChartJSComponentSupplierProvider;
//# sourceMappingURL=ChartJSComponentSupplierProvider.js.map