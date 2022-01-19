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
exports.URLPathProvider = exports.useURLPathContext = exports.URLPathContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const query_string_1 = __importDefault(require("query-string"));
const react_router_dom_1 = require("react-router-dom");
exports.URLPathContext = React.createContext(undefined);
const useURLPathContext = () => {
    const context = React.useContext(exports.URLPathContext);
    if (!context) {
        throw new Error("useURLPathContext must be used within a URLPathContext.Provider");
    }
    return context;
};
exports.useURLPathContext = useURLPathContext;
const URLPathProvider = (props) => {
    const [configPath] = (0, react_1.useState)(props.configPath);
    const [basePathRoot] = (0, react_1.useState)(props.basePath);
    const [basePath] = (0, react_1.useState)(`${props.basePath}/:canisterId`);
    const pathToSection = (0, react_1.useCallback)((section) => {
        return (0, react_router_dom_1.generatePath)(query_string_1.default.stringifyUrl({ url: basePath }), { canisterId: section });
    }, [basePath]);
    const value = (0, react_1.useMemo)(() => ({
        configPath: configPath,
        basePathRoot: basePathRoot,
        basePath: basePath,
        pathToSection: pathToSection
    }), [
        configPath,
        basePathRoot,
        basePath,
        pathToSection
    ]);
    return React.createElement(exports.URLPathContext.Provider, { value: value }, props.children);
};
exports.URLPathProvider = URLPathProvider;
//# sourceMappingURL=URLPathProvider.js.map