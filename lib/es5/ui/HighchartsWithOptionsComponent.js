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
exports.HighchartsWithOptionsComponent = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const lodash_1 = __importDefault(require("lodash"));
const highcharts_react_official_1 = __importDefault(require("highcharts-react-official"));
const highcharts_1 = __importDefault(require("highcharts"));
const exporting_1 = __importDefault(require("highcharts/modules/exporting"));
const offline_exporting_1 = __importDefault(require("highcharts/modules/offline-exporting"));
const HighchartsThemeFacade_1 = require("./HighchartsThemeFacade");
(0, exporting_1.default)(highcharts_1.default);
(0, offline_exporting_1.default)(highcharts_1.default);
window.Highcharts = highcharts_1.default;
HighchartsThemeFacade_1.HighchartsThemeFacade.applyTheme(HighchartsThemeFacade_1.UsergeekHighchartsTheme.default);
exports.HighchartsWithOptionsComponent = React.memo(({ options }) => {
    const highchartsRef = (0, react_1.useRef)(null);
    return React.createElement(React.Fragment, null,
        React.createElement(highcharts_react_official_1.default, { ref: highchartsRef, highcharts: highcharts_1.default, options: options, containerProps: { style: { width: "100%" } }, immutable: true }));
}, (prevProps, nextProps) => {
    return lodash_1.default.isEqual(prevProps, nextProps);
});
exports.HighchartsWithOptionsComponent.displayName = "HighchartsWithOptionsComponent";
//# sourceMappingURL=HighchartsWithOptionsComponent.js.map