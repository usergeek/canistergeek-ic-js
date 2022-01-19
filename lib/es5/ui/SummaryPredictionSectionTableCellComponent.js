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
exports.SummaryPredictionSectionTableCellComponent = void 0;
const React = __importStar(require("react"));
const SummaryHelpPopoverWithEmptyData_1 = require("./SummaryHelpPopoverWithEmptyData");
const CommonNoDataLabel_1 = require("./CommonNoDataLabel");
const SummaryHelpPopoverWithData_1 = require("./SummaryHelpPopoverWithData");
const antd_1 = require("antd");
function SummaryPredictionSectionTableCellComponent(props) {
    if (props.data) {
        const metricWrapper = props.data.metricWrapper;
        if (metricWrapper) {
            const hasValue = metricWrapper.hasValue;
            if (hasValue) {
                return React.createElement(antd_1.Row, { align: "middle", gutter: 8 },
                    React.createElement(antd_1.Col, { flex: "auto" },
                        React.createElement(antd_1.Progress, { type: "line", percent: metricWrapper.percentFromMax, strokeColor: metricWrapper.colorHex, showInfo: false })),
                    React.createElement(antd_1.Col, null, metricWrapper.label),
                    React.createElement(antd_1.Col, null,
                        React.createElement(SummaryHelpPopoverWithData_1.SummaryHelpPopoverWithData, { data: props.data, predictionLabel: metricWrapper.label, differenceTitlePostfix: props.differenceTitlePostfix })));
            }
            let emptyDataLabel = null;
            if (props.metric == "cycles") {
                if (props.data.data.difference == 0) {
                    emptyDataLabel = React.createElement(React.Fragment, null, "No cycles were burned");
                }
                else {
                    emptyDataLabel = React.createElement(React.Fragment, null, "Looks like cycles topped up");
                }
            }
            else if (props.metric == "memory") {
                if (props.data.data.difference == 0) {
                    emptyDataLabel = React.createElement(React.Fragment, null, "No memory was changed");
                }
                else {
                    emptyDataLabel = React.createElement(React.Fragment, null, "Looks like memory freed up");
                }
            }
            return React.createElement(React.Fragment, null,
                React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null),
                React.createElement(SummaryHelpPopoverWithEmptyData_1.SummaryHelpPopoverWithEmptyData, { data: props.data, differenceTitlePostfix: props.differenceTitlePostfix, emptyDataLabel: emptyDataLabel, iconColor: metricWrapper.colorHex }));
        }
    }
    return React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null);
}
exports.SummaryPredictionSectionTableCellComponent = SummaryPredictionSectionTableCellComponent;
//# sourceMappingURL=SummaryPredictionSectionTableCellComponent.js.map