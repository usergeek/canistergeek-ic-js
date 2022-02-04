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
exports.SummaryHelpPopoverWithEmptyData = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const AbstractHelpPopover_1 = require("./AbstractHelpPopover");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const DateTimeUtils_1 = require("./DateTimeUtils");
function SummaryHelpPopoverWithEmptyData(props) {
    return React.createElement(AbstractHelpPopover_1.AbstractHelpPopover, { title: "Prediction based on 2 data points", content: React.createElement(React.Fragment, null,
            React.createElement(antd_1.Space, { direction: "vertical" },
                React.createElement("div", null,
                    React.createElement("div", null,
                        "From: ",
                        DateTimeUtils_1.DateTimeUtils.formatDate(props.data.date.fromMillis, "dayTime")),
                    React.createElement("div", null,
                        "To: ",
                        DateTimeUtils_1.DateTimeUtils.formatDate(props.data.date.toMillis, "dayTime"))),
                React.createElement("div", null,
                    "Difference: ",
                    CalculationUtils_1.CalculationUtils.formatNumericValue(props.data.data.difference),
                    props.differenceTitlePostfix),
                React.createElement("div", null, "Prediction: n/a"),
                React.createElement(antd_1.Alert, { type: "warning", message: props.emptyDataLabel, showIcon: true }))), iconColor: props.iconColor });
}
exports.SummaryHelpPopoverWithEmptyData = SummaryHelpPopoverWithEmptyData;
//# sourceMappingURL=SummaryHelpPopoverWithEmptyData.js.map