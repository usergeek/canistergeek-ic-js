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
exports.ConfigurationJSONInterfaceComponent = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const interfaceString = "export type CanisterId = string\n" +
    "export type CanisterMetricsSource = \"canister\" | \"blackhole\"\n" +
    "\n" +
    "export type Canister = {\n" +
    "    canisterId: CanisterId\n" +
    "    name?: string,\n" +
    "    metricsSource?: Array<CanisterMetricsSource>\n" +
    "}\n" +
    "\n" +
    "type ThresholdStep = {\n" +
    "    value: number,\n" +
    "    colorHex: string\n" +
    "}\n" +
    "\n" +
    "type BaseThreshold = {\n" +
    "    colorHex: string\n" +
    "}\n" +
    "\n" +
    "export type MetricsFormat = \"none\" | \"memoryShort\" | \"cyclesShort\"\n" +
    "\n" +
    "export type MetricsThresholds = {\n" +
    "    mode?: \"absolute\"\n" +
    "    base: BaseThreshold\n" +
    "    steps?: Array<ThresholdStep>\n" +
    "}\n" +
    "\n" +
    "type ConfigurationMetricsCycles = {\n" +
    "    metricsFormat?: MetricsFormat\n" +
    "    thresholds?: MetricsThresholds\n" +
    "    predictionThresholds?: MetricsThresholds\n" +
    "}\n" +
    "\n" +
    "export type ConfigurationMetricsMemory = {\n" +
    "    metricsFormat?: MetricsFormat\n" +
    "    thresholds?: MetricsThresholds\n" +
    "    predictionThresholds?: MetricsThresholds\n" +
    "    limitations?: {\n" +
    "        hourly?: {\n" +
    "            maxValue?: number\n" +
    "            percentFromMaxMinValue?: number\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "export type ConfigurationMetrics = {\n" +
    "    cycles?: ConfigurationMetricsCycles\n" +
    "    memory?: ConfigurationMetricsMemory\n" +
    "    heapMemory?: ConfigurationMetricsMemory\n" +
    "}\n" +
    "\n" +
    "export type Configuration = {\n" +
    "    canisters: Array<Canister>\n" +
    "    metrics?: ConfigurationMetrics,\n" +
    "}";
const ConfigurationJSONInterfaceComponent = () => {
    return React.createElement(antd_1.Typography, null,
        React.createElement("pre", { style: { fontSize: "0.7em" } }, interfaceString));
};
exports.ConfigurationJSONInterfaceComponent = ConfigurationJSONInterfaceComponent;
//# sourceMappingURL=ConfigurationJSONInterfaceComponent.js.map