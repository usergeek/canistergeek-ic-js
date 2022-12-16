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
export type CanisterLogFeature = { 'filterMessageByContains': null } |
    { 'filterMessageByRegex': null };

export interface CanisterLogMessages {
    'data': Array<LogMessagesData>,
    'lastAnalyzedMessageTimeNanos': [] | [Nanos],
}

export interface CanisterLogMessagesInfo {
    'features': Array<[] | [CanisterLogFeature]>,
    'lastTimeNanos': [] | [Nanos],
    'count': number,
    'firstTimeNanos': [] | [Nanos],
}

export type CanisterLogRequest = { 'getMessagesInfo': null } |
    { 'getMessages': GetLogMessagesParameters } |
    { 'getLatestMessages': GetLatestLogMessagesParameters };
export type CanisterLogResponse = { 'messagesInfo': CanisterLogMessagesInfo } |
    { 'messages': CanisterLogMessages };

export interface GetLatestLogMessagesParameters {
    'upToTimeNanos': [] | [Nanos],
    'count': number,
    'filter': [] | [GetLogMessagesFilter],
}

export interface GetLogMessagesFilter {
    'messageRegex': [] | [string],
    'analyzeCount': number,
    'messageContains': [] | [string],
}

export interface GetLogMessagesParameters {
    'count': number,
    'filter': [] | [GetLogMessagesFilter],
    'fromTimeNanos': [] | [Nanos],
}

export interface LogMessagesData {
    'timeNanos': Nanos,
    'message': string
}

export type Nanos = bigint;

export interface StatusRequest {
    'memory_size' : boolean,
    'cycles' : boolean,
    'heap_memory_size' : boolean,
}
export interface StatusResponse {
    'memory_size' : [] | [bigint],
    'cycles' : [] | [bigint],
    'heap_memory_size' : [] | [bigint],
}
export interface MetricsRequest { 'parameters' : GetMetricsParameters }
export interface MetricsResponse { 'metrics' : [] | [CanisterMetrics] }
export interface GetInformationRequest {
    'status' : [] | [StatusRequest],
    'metrics' : [] | [MetricsRequest],
    'logs' : [] | [CanisterLogRequest],
    'version' : boolean,
}
export interface GetInformationResponse {
  'status' : [] | [StatusResponse],
  'metrics' : [] | [MetricsResponse],
  'logs' : [] | [CanisterLogResponse],
  'version' : [] | [bigint],
}
export type CollectMetricsRequestType = { 'force' : null } |
    { 'normal' : null };
export interface UpdateInformationRequest {
  'metrics' : [] | [CollectMetricsRequestType],
}

export interface _SERVICE {
    'collectCanisterMetrics': () => Promise<undefined>,
    'getCanisterMetrics': (arg_0: GetMetricsParameters) => Promise<[] | [CanisterMetrics]>,
    'getCanisterLog': (arg_0: [] | [CanisterLogRequest]) => Promise<[] | [CanisterLogResponse]>,
    'getCanistergeekInformation': (arg_0: GetInformationRequest) => Promise<GetInformationResponse>,
    'updateCanistergeekInformation': (arg_0: UpdateInformationRequest) => Promise<undefined>,
}
