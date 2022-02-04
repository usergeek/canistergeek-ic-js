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
exports.ChartJSWithOptionsComponent = exports.getColorByIndex = exports.ColorsDictionary = void 0;
const React = __importStar(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const chart_js_1 = require("chart.js");
require("chartjs-adapter-moment");
const react_chartjs_2_1 = require("react-chartjs-2");
const DateTimeUtils_1 = require("./DateTimeUtils");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.TimeScale);
exports.ColorsDictionary = {
    blue: "#7cb5ec",
    black: "#434348",
    lime: "#90ed7d",
    orange: "#f7a35c",
    darkblue: "#8085e9",
    pink: "#f15c80",
    yellow: "#e4d354",
    green: "#2b908f",
    red: "#f45b5b",
    lightblue: "#91e8e1",
};
const Colors = [exports.ColorsDictionary.blue,
    exports.ColorsDictionary.black,
    exports.ColorsDictionary.lime,
    exports.ColorsDictionary.orange,
    exports.ColorsDictionary.darkblue,
    exports.ColorsDictionary.pink,
    exports.ColorsDictionary.yellow,
    exports.ColorsDictionary.green,
    exports.ColorsDictionary.red,
    exports.ColorsDictionary.lightblue
];
const getColorByIndex = (index) => Colors[index % Colors.length];
exports.getColorByIndex = getColorByIndex;
chart_js_1.Chart.overrides.line.animation = false;
chart_js_1.Chart.defaults.responsive = true;
chart_js_1.Chart.defaults.maintainAspectRatio = false;
chart_js_1.Chart.defaults.interaction.intersect = false;
chart_js_1.Chart.defaults.plugins.legend = {
    ...chart_js_1.Chart.defaults.plugins.legend,
    display: false
};
chart_js_1.Chart.defaults.plugins.tooltip = {
    ...chart_js_1.Chart.defaults.plugins.tooltip,
    backgroundColor: "rgba(247,247,247,0.85)",
    titleColor: "#333333",
    borderColor: ctx => (0, exports.getColorByIndex)(ctx.tooltipItems[0].datasetIndex),
    borderWidth: 1,
};
chart_js_1.Chart.defaults.plugins.tooltip.callbacks = {
    ...chart_js_1.Chart.defaults.plugins.tooltip.callbacks,
    title: tooltipItems => {
        return DateTimeUtils_1.DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day");
    },
    labelTextColor: (tooltipItem) => '#333333',
    label: tooltipItem => ` ${tooltipItem.parsed.y}`
};
exports.ChartJSWithOptionsComponent = React.memo(({ chartContext, cssProps }) => {
    return React.createElement(React.Fragment, null,
        React.createElement(react_chartjs_2_1.Line, { options: chartContext.options, data: chartContext.data, style: { width: "100%", height: "432px", ...cssProps } }));
}, (prevProps, nextProps) => {
    return lodash_1.default.isEqual(prevProps, nextProps);
});
exports.ChartJSWithOptionsComponent.displayName = "ChartJSWithOptionsComponent";
//# sourceMappingURL=ChartJSWithOptionsComponent.js.map