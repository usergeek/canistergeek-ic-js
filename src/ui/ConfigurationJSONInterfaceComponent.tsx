import * as React from "react";
import {Typography} from "antd";

const interfaceString = "export type CanisterId = string\n" +
    "\n" +
    "export type Canister = {\n" +
    "    canisterId: CanisterId\n" +
    "    name?: string\n" +
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
    "}"

export const ConfigurationJSONInterfaceComponent = () => {
    return <Typography>
        <pre style={{fontSize: "0.7em"}}>
            {interfaceString}
        </pre>
    </Typography>
}