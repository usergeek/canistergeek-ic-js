import * as React from "react";
import {Typography} from "antd";
import {Configuration} from "../dataProvider/ConfigurationProvider";
import {MEMORY_MAX_PER_CANISTER} from "../dataProvider/Constants";

export const exampleConfiguration: Configuration = {
    canisters: [
        {
            canisterId: "rdmx6-jaaaa-aaaaa-aaadq-cai",
            name: "nns/identity"
        },
        {
            canisterId: "e3mmv-5qaaa-aaaah-aadma-cai",
            name: "assetCanister",
            metricsSource: ["blackhole"]
        }
    ],
    metrics: {
        cycles: {
            metricsFormat: "cyclesShort",
            thresholds: { // indicator color based on cycles value
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 300_000_000_000, // 0.3T cycles
                        colorHex: "darkorange"
                    },
                    {
                        value: 700_000_000_000, // 0.7T cycles
                        colorHex: "green"
                    }
                ]
            },
            predictionThresholds: { // How fast cycles in the canister will run out (in days)
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 30, // 30 days
                        colorHex: "darkorange"
                    },
                    {
                        value: 90, // 90 days
                        colorHex: "green"
                    }
                ]
            }
        },
        memory: {
            metricsFormat: "memoryShort",
            thresholds: { // indicator color based on memory value
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 1, // 1 byte
                        colorHex: "green"
                    }, {
                        value: 300 * 1024 * 1024, // 300 Mb
                        colorHex: "darkorange"
                    }, {
                        value: 400 * 1024 * 1024, // 400 Mb
                        colorHex: "red"
                    }
                ],
            },
            predictionThresholds: { // How fast the canister will run out of memory (in days)
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 30, // 30 days
                        colorHex: "darkorange"
                    },
                    {
                        value: 90, // 90 days
                        colorHex: "green"
                    }
                ]
            },
            limitations: {
                hourly: {
                    maxValue: MEMORY_MAX_PER_CANISTER,
                    percentFromMaxMinValue: 5
                }
            }
        },
        heapMemory: {
            metricsFormat: "memoryShort",
            thresholds: { // indicator color based on heap memory value
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 1, //1 byte
                        colorHex: "green"
                    }, {
                        value: 300 * 1024 * 1024, //300 Mb
                        colorHex: "darkorange"
                    }, {
                        value: 400 * 1024 * 1024, //400 Mb
                        colorHex: "red"
                    }
                ],
            },
            limitations: {
                hourly: {
                    maxValue: MEMORY_MAX_PER_CANISTER,
                    percentFromMaxMinValue: 5
                }
            }
        }
    }
}

export const exampleConfigurationJSON = JSON.stringify(exampleConfiguration, null, 4)

const jsonExampleString = "{\n" +
    "    canisters: [\n" +
    "        {\n" +
    "            canisterId: \"rdmx6-jaaaa-aaaaa-aaadq-cai\", // regular motoko/rust canister\n" +
    "            name: \"nns/identity\"\n" +
    "        },\n" +
    "        {\n" +
    "            canisterId: \"e3mmv-5qaaa-aaaah-aadma-cai\", // canister with public status using blackhole canister (https://github.com/ninegua/ic-blackhole). Useful to monitor asset canisters.\n" +
    "            name: \"assetCanister\",\n" +
    "            metricsSource: [\"blackhole\"]\n" +
    "        }\n" +
    "    ],\n" +
    "    metrics: {\n" +
    "        cycles: {\n" +
    "            metricsFormat: \"cyclesShort\",\n" +
    "            thresholds: { // indicator color based on cycles value\n" +
    "                base: {\n" +
    "                    colorHex: \"red\"\n" +
    "                },\n" +
    "                steps: [\n" +
    "                    {\n" +
    "                        value: 300_000_000_000, // 0.3T cycles\n" +
    "                        colorHex: \"darkorange\"\n" +
    "                    },\n" +
    "                    {\n" +
    "                        value: 700_000_000_000, // 0.7T cycles\n" +
    "                        colorHex: \"green\"\n" +
    "                    }\n" +
    "                ]\n" +
    "            },\n" +
    "            predictionThresholds: { // How fast cycles in the canister will run out (in days)\n" +
    "                base: {\n" +
    "                    colorHex: \"red\"\n" +
    "                },\n" +
    "                steps: [\n" +
    "                    {\n" +
    "                        value: 30, // 30 days\n" +
    "                        colorHex: \"darkorange\"\n" +
    "                    },\n" +
    "                    {\n" +
    "                        value: 90, // 90 days\n" +
    "                        colorHex: \"green\"\n" +
    "                    }\n" +
    "                ]\n" +
    "            }\n" +
    "        },\n" +
    "        memory: {\n" +
    "            metricsFormat: \"memoryShort\",\n" +
    "            thresholds: { // indicator color based on memory value\n" +
    "                base: {\n" +
    "                    colorHex: \"red\"\n" +
    "                },\n" +
    "                steps: [\n" +
    "                    {\n" +
    "                        value: 1, // 1 byte\n" +
    "                        colorHex: \"green\"\n" +
    "                    }, {\n" +
    "                        value: 300 * 1024 * 1024, // 300 Mb\n" +
    "                        colorHex: \"darkorange\"\n" +
    "                    }, {\n" +
    "                        value: 400 * 1024 * 1024, // 400 Mb\n" +
    "                        colorHex: \"red\"\n" +
    "                    }\n" +
    "                ],\n" +
    "            },\n" +
    "            predictionThresholds: { // How fast the canister will run out of memory (in days)\n" +
    "                base: {\n" +
    "                    colorHex: \"red\"\n" +
    "                },\n" +
    "                steps: [\n" +
    "                    {\n" +
    "                        value: 30, // 30 days\n" +
    "                        colorHex: \"darkorange\"\n" +
    "                    },\n" +
    "                    {\n" +
    "                        value: 90, // 90 days\n" +
    "                        colorHex: \"green\"\n" +
    "                    }\n" +
    "                ]\n" +
    "            },\n" +
    "            limitations: {\n" +
    "                hourly: {\n" +
    "                    maxValue: MEMORY_MAX_PER_CANISTER,\n" +
    "                    percentFromMaxMinValue: 5\n" +
    "                }\n" +
    "            }\n" +
    "        },\n" +
    "        heapMemory: {\n" +
    "            metricsFormat: \"memoryShort\",\n" +
    "            thresholds: { // indicator color based on heap memory value\n" +
    "                base: {\n" +
    "                    colorHex: \"red\"\n" +
    "                },\n" +
    "                steps: [\n" +
    "                    {\n" +
    "                        value: 1, //1 byte\n" +
    "                        colorHex: \"green\"\n" +
    "                    }, {\n" +
    "                        value: 300 * 1024 * 1024, //300 Mb\n" +
    "                        colorHex: \"darkorange\"\n" +
    "                    }, {\n" +
    "                        value: 400 * 1024 * 1024, //400 Mb\n" +
    "                        colorHex: \"red\"\n" +
    "                    }\n" +
    "                ],\n" +
    "            },\n" +
    "            limitations: {\n" +
    "                hourly: {\n" +
    "                    maxValue: MEMORY_MAX_PER_CANISTER,\n" +
    "                    percentFromMaxMinValue: 5\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "    }\n" +
    "}\n"

export const ConfigurationJSONExampleComponent = () => {
    return <Typography>
        <pre style={{fontSize: "0.7em"}}>
            {jsonExampleString}
        </pre>
    </Typography>
}