export type CanisterCyclesAggregatedData = Array<bigint>;
export type CanisterHeapMemoryAggregatedData = Array<bigint>;
export type CanisterMemoryAggregatedData = Array<bigint>;

export interface CanisterMetrics {
    'data': CanisterMetricsData
}

export type CanisterMetricsData = { 'hourly': Array<HourlyMetricsData> } |
    { 'daily': Array<DailyMetricsData> };

export interface DailyMetricsData {
    'updateCalls': bigint,
    'canisterHeapMemorySize': NumericEntity,
    'canisterCycles': NumericEntity,
    'canisterMemorySize': NumericEntity,
    'timeMillis': bigint,
}

export interface GetMetricsParameters {
    'dateToMillis': bigint,
    'granularity': MetricsGranularity,
    'dateFromMillis': bigint,
}

export interface HourlyMetricsData {
    'updateCalls': UpdateCallsAggregatedData,
    'canisterHeapMemorySize': CanisterHeapMemoryAggregatedData,
    'canisterCycles': CanisterCyclesAggregatedData,
    'canisterMemorySize': CanisterMemoryAggregatedData,
    'timeMillis': bigint,
}

export type MetricsGranularity = { 'hourly': null } |
    { 'daily': null };

export interface NumericEntity {
    'avg': bigint,
    'max': bigint,
    'min': bigint,
    'first': bigint,
    'last': bigint,
}

export type UpdateCallsAggregatedData = Array<bigint>;

export interface _SERVICE {
    'collectCanisterMetrics': () => Promise<undefined>,
    'getCanisterMetrics': (arg_0: GetMetricsParameters) => Promise<[] | [CanisterMetrics]>,
}
