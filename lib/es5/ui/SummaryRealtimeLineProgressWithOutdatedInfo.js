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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryRealtimeLineProgressWithOutdatedInfo = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const Constants_1 = require("../dataProvider/Constants");
const DateUtils_1 = require("../dataProvider/DateUtils");
function SummaryRealtimeLineProgressWithOutdatedInfo(props) {
    const metricWrapper = props.metricWrapper;
    if (metricWrapper) {
        let outdatedContent = null;
        if (metricWrapper.outdatedContext) {
            const differencesBetweenToMillis = DateUtils_1.DateUtils.Diff.getDifferenceBetweenToMillis(metricWrapper.outdatedContext.actualTimeMillis, new Date().getTime());
            const diffString = DateUtils_1.DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis);
            outdatedContent = React.createElement(React.Fragment, null,
                React.createElement("div", { style: { fontSize: "0.75em", color: "darkgray" } },
                    "(",
                    diffString,
                    " ago)"));
        }
        if (metricWrapper.hasValue) {
            return React.createElement(antd_1.Row, { align: "middle", gutter: 8, style: { marginRight: "20px" } },
                React.createElement(antd_1.Col, { flex: "auto" },
                    React.createElement(antd_1.Progress, { type: "line", percent: Math.max(7, metricWrapper.percentFromMax), strokeColor: metricWrapper.colorHex, showInfo: false })),
                React.createElement(antd_1.Col, null, metricWrapper.label),
                outdatedContent ? React.createElement(antd_1.Col, null, outdatedContent) : null);
        }
    }
    return React.createElement("span", { style: { color: Constants_1.COLOR_GRAY_HEX } }, Constants_1.NO_OBJECT_VALUE_LABEL);
}
exports.SummaryRealtimeLineProgressWithOutdatedInfo = SummaryRealtimeLineProgressWithOutdatedInfo;
//# sourceMappingURL=SummaryRealtimeLineProgressWithOutdatedInfo.js.map