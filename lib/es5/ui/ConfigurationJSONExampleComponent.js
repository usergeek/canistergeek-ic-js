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
exports.ConfigurationJSONExampleComponent = exports.exampleConfigurationJSON = exports.exampleConfiguration = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const Constants_1 = require("../dataProvider/Constants");
exports.exampleConfiguration = {
    canisters: [
        {
            canisterId: "rdmx6-jaaaa-aaaaa-aaadq-cai",
            name: "nns/identity"
        },
        {
            canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
            name: "nns/ledger"
        }
    ],
    metrics: {
        cycles: {
            metricsFormat: "cyclesShort",
            thresholds: {
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 300000000000,
                        colorHex: "darkorange"
                    },
                    {
                        value: 700000000000,
                        colorHex: "green"
                    }
                ]
            },
            predictionThresholds: {
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 30,
                        colorHex: "darkorange"
                    },
                    {
                        value: 90,
                        colorHex: "green"
                    }
                ]
            }
        },
        memory: {
            metricsFormat: "memoryShort",
            thresholds: {
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 1,
                        colorHex: "green"
                    }, {
                        value: 300 * 1024 * 1024,
                        colorHex: "darkorange"
                    }, {
                        value: 400 * 1024 * 1024,
                        colorHex: "red"
                    }
                ],
            },
            predictionThresholds: {
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 30,
                        colorHex: "darkorange"
                    },
                    {
                        value: 90,
                        colorHex: "green"
                    }
                ]
            },
            limitations: {
                hourly: {
                    maxValue: Constants_1.MEMORY_MAX_PER_CANISTER,
                    percentFromMaxMinValue: 5
                }
            }
        },
        heapMemory: {
            metricsFormat: "memoryShort",
            thresholds: {
                base: {
                    colorHex: "red"
                },
                steps: [
                    {
                        value: 1,
                        colorHex: "green"
                    }, {
                        value: 300 * 1024 * 1024,
                        colorHex: "darkorange"
                    }, {
                        value: 400 * 1024 * 1024,
                        colorHex: "red"
                    }
                ],
            },
            limitations: {
                hourly: {
                    maxValue: Constants_1.MEMORY_MAX_PER_CANISTER,
                    percentFromMaxMinValue: 5
                }
            }
        }
    }
};
exports.exampleConfigurationJSON = JSON.stringify(exports.exampleConfiguration, null, 4);
const jsonExampleString = "{\n" +
    "    canisters: [\n" +
    "        {\n" +
    "            canisterId: \"rdmx6-jaaaa-aaaaa-aaadq-cai\",\n" +
    "            name: \"nns/identity\"\n" +
    "        },\n" +
    "        {\n" +
    "            canisterId: \"ryjl3-tyaaa-aaaaa-aaaba-cai\",\n" +
    "            name: \"nns/ledger\"\n" +
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
    "}\n";
const ConfigurationJSONExampleComponent = () => {
    return React.createElement(antd_1.Typography, null,
        React.createElement("pre", { style: { fontSize: "0.7em" } }, jsonExampleString));
};
exports.ConfigurationJSONExampleComponent = ConfigurationJSONExampleComponent;
//# sourceMappingURL=ConfigurationJSONExampleComponent.js.map