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
exports.SummaryRealtimeSimpleMetricWrapperLabelComponent = void 0;
const React = __importStar(require("react"));
const DateUtils_1 = require("../dataProvider/DateUtils");
const Constants_1 = require("../dataProvider/Constants");
function SummaryRealtimeSimpleMetricWrapperLabelComponent(props) {
    const value = props.metricWrapper;
    if (value === null || value === void 0 ? void 0 : value.hasValue) {
        let outdatedContent = null;
        if (value === null || value === void 0 ? void 0 : value.outdatedContext) {
            const differencesBetweenToMillis = DateUtils_1.DateUtils.Diff.getDifferenceBetweenToMillis(value === null || value === void 0 ? void 0 : value.outdatedContext.actualTimeMillis, new Date().getTime());
            const diffString = DateUtils_1.DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis);
            outdatedContent = React.createElement("span", { style: { fontSize: "0.8em", color: "darkgray" } },
                "(",
                diffString,
                " ago)");
        }
        return React.createElement("span", { style: { color: value === null || value === void 0 ? void 0 : value.colorHex } }, value === null || value === void 0 ? void 0 :
            value.label,
            " ",
            outdatedContent);
    }
    return React.createElement("span", { style: { color: Constants_1.COLOR_GRAY_HEX } }, Constants_1.NO_OBJECT_VALUE_LABEL);
}
exports.SummaryRealtimeSimpleMetricWrapperLabelComponent = SummaryRealtimeSimpleMetricWrapperLabelComponent;
//# sourceMappingURL=SummaryRealtimeSimpleMetricWrapperLabelComponent.js.map