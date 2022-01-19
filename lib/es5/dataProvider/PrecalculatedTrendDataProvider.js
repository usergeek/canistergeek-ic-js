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
exports.PrecalculatedTrendDataProvider = exports.usePrecalculatedTrendDataContext = exports.PrecalculatedTrendDataContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const use_custom_compare_1 = require("use-custom-compare");
const lodash_1 = __importDefault(require("lodash"));
const DataProvider_1 = require("./DataProvider");
const PrecalculatedTrendDataProviderCalculator_1 = require("./PrecalculatedTrendDataProviderCalculator");
exports.PrecalculatedTrendDataContext = React.createContext(undefined);
const usePrecalculatedTrendDataContext = () => {
    const context = React.useContext(exports.PrecalculatedTrendDataContext);
    if (!context) {
        throw new Error("usePrecalculatedTrendDataContext must be used within a PrecalculatedTrendDataContext.Provider");
    }
    return context;
};
exports.usePrecalculatedTrendDataContext = usePrecalculatedTrendDataContext;
const PrecalculatedTrendDataProvider = (props) => {
    const dataContext = (0, DataProvider_1.useDataContext)();
    const [precalculatedData, setPrecalculatedData] = (0, react_1.useState)({});
    (0, use_custom_compare_1.useCustomCompareEffect)(() => {
        setPrecalculatedData(PrecalculatedTrendDataProviderCalculator_1.PrecalculatedTrendDataProviderCalculator.getPrecalculatedData(dataContext.dataHourly));
    }, [dataContext.dataHourly], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
        precalculatedData: precalculatedData
    }), [precalculatedData], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    return React.createElement(exports.PrecalculatedTrendDataContext.Provider, { value: value }, props.children);
};
exports.PrecalculatedTrendDataProvider = PrecalculatedTrendDataProvider;
//# sourceMappingURL=PrecalculatedTrendDataProvider.js.map