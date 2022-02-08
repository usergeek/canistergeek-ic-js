# Canistergeek-IC-JS

Canistergeek-IC-JS is Javascript library that fetches the monitoring data from canisters, perform all necessary calculations and displays it on a webpage.

Canistergeek-IC-JS should be used together with [Canistergeek-IC-Motoko](https://github.com/usergeek/canistergeek-ic-motoko) or [Canistergeek-IC-Rust](https://github.com/usergeek/canistergeek_ic_rust) - open-source libraries for Internet Computer to track your project canisters cycles and memory status.

### Usage

Full working example how to use Canistergeek-IC-JS library can be found in [Canistergeek Demo UI](https://github.com/usergeek/canistergeek-demo-ui) repository.

### Configuration

Configuration is the only input needed from a user.

**Typescript interface**

```typescript
export type CanisterId = string
export type CanisterMetricsSource = "canister" | "blackhole"

export type Canister = {
    canisterId: CanisterId
    name?: string,
    metricsSource?: Array<CanisterMetricsSource>
}

type ThresholdStep = {
    value: number,
    colorHex: string
}

type BaseThreshold = {
    colorHex: string
}

export type MetricsFormat = "none" | "memoryShort" | "cyclesShort"

export type MetricsThresholds = {
    mode?: "absolute"
    base: BaseThreshold
    steps?: Array<ThresholdStep>
}

type ConfigurationMetricsCycles = {
    metricsFormat?: MetricsFormat
    thresholds?: MetricsThresholds
    predictionThresholds?: MetricsThresholds
}

export type ConfigurationMetricsMemory = {
    metricsFormat?: MetricsFormat
    thresholds?: MetricsThresholds
    predictionThresholds?: MetricsThresholds
    limitations?: {
        hourly?: {
            maxValue?: number
            percentFromMaxMinValue?: number
        }
    }
}

export type ConfigurationMetrics = {
    cycles?: ConfigurationMetricsCycles
    memory?: ConfigurationMetricsMemory
    heapMemory?: ConfigurationMetricsMemory
}

export type Configuration = {
    canisters: Array<Canister>
    metrics?: ConfigurationMetrics,
}
```

**Full JSON example with comments**

```
const MEMORY_MAX_PER_CANISTER = 2 * 1024 * 1024 * 1024 // 2Gb

{
    canisters: [
        {
            canisterId: "rdmx6-jaaaa-aaaaa-aaadq-cai",// regular motoko/rust canister
            name: "nns/identity"
        },
        {
            canisterId: "e3mmv-5qaaa-aaaah-aadma-cai",// canister with public status using blackhole canister (https://github.com/ninegua/ic-blackhole). Useful to monitor asset canisters.
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
```