"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanisterActor = void 0;
const agent_1 = require("@dfinity/agent");
const idlFactory = ({ IDL }) => {
    const MetricsGranularity = IDL.Variant({
        'hourly': IDL.Null,
        'daily': IDL.Null,
    });
    const GetMetricsParameters = IDL.Record({
        'dateToMillis': IDL.Nat,
        'granularity': MetricsGranularity,
        'dateFromMillis': IDL.Nat,
    });
    const UpdateCallsAggregatedData = IDL.Vec(IDL.Nat64);
    const CanisterHeapMemoryAggregatedData = IDL.Vec(IDL.Nat64);
    const CanisterCyclesAggregatedData = IDL.Vec(IDL.Nat64);
    const CanisterMemoryAggregatedData = IDL.Vec(IDL.Nat64);
    const HourlyMetricsData = IDL.Record({
        'updateCalls': UpdateCallsAggregatedData,
        'canisterHeapMemorySize': CanisterHeapMemoryAggregatedData,
        'canisterCycles': CanisterCyclesAggregatedData,
        'canisterMemorySize': CanisterMemoryAggregatedData,
        'timeMillis': IDL.Int,
    });
    const NumericEntity = IDL.Record({
        'avg': IDL.Nat64,
        'max': IDL.Nat64,
        'min': IDL.Nat64,
        'first': IDL.Nat64,
        'last': IDL.Nat64,
    });
    const DailyMetricsData = IDL.Record({
        'updateCalls': IDL.Nat64,
        'canisterHeapMemorySize': NumericEntity,
        'canisterCycles': NumericEntity,
        'canisterMemorySize': NumericEntity,
        'timeMillis': IDL.Int,
    });
    const CanisterMetricsData = IDL.Variant({
        'hourly': IDL.Vec(HourlyMetricsData),
        'daily': IDL.Vec(DailyMetricsData),
    });
    const CanisterMetrics = IDL.Record({ 'data': CanisterMetricsData });
    const GetLogMessagesFilter = IDL.Record({
        'messageRegex': IDL.Opt(IDL.Text),
        'analyzeCount': IDL.Nat32,
        'messageContains': IDL.Opt(IDL.Text),
    });
    const Nanos = IDL.Nat64;
    const GetLogMessagesParameters = IDL.Record({
        'count': IDL.Nat32,
        'filter': IDL.Opt(GetLogMessagesFilter),
        'fromTimeNanos': IDL.Opt(Nanos),
    });
    const GetLatestLogMessagesParameters = IDL.Record({
        'upToTimeNanos': IDL.Opt(Nanos),
        'count': IDL.Nat32,
        'filter': IDL.Opt(GetLogMessagesFilter),
    });
    const CanisterLogRequest = IDL.Variant({
        'getMessagesInfo': IDL.Null,
        'getMessages': GetLogMessagesParameters,
        'getLatestMessages': GetLatestLogMessagesParameters,
    });
    const CanisterLogFeature = IDL.Variant({
        'filterMessageByContains': IDL.Null,
        'filterMessageByRegex': IDL.Null,
    });
    const CanisterLogMessagesInfo = IDL.Record({
        'features': IDL.Vec(IDL.Opt(CanisterLogFeature)),
        'lastTimeNanos': IDL.Opt(Nanos),
        'count': IDL.Nat32,
        'firstTimeNanos': IDL.Opt(Nanos),
    });
    const LogMessagesData = IDL.Record({
        'timeNanos': Nanos,
        'message': IDL.Text,
    });
    const CanisterLogMessages = IDL.Record({
        'data': IDL.Vec(LogMessagesData),
        'lastAnalyzedMessageTimeNanos': IDL.Opt(Nanos),
    });
    const CanisterLogResponse = IDL.Variant({
        'messagesInfo': CanisterLogMessagesInfo,
        'messages': CanisterLogMessages,
    });
    return IDL.Service({
        'collectCanisterMetrics': IDL.Func([], [], []),
        'getCanisterMetrics': IDL.Func([GetMetricsParameters], [IDL.Opt(CanisterMetrics)], ['query']),
        'getCanisterLog': IDL.Func([IDL.Opt(CanisterLogRequest)], [IDL.Opt(CanisterLogResponse)], ['query']),
    });
};
/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./canistergeek.did.d.ts")._SERVICE>}
 */
const createActor = (canisterId, options) => {
    const agent = new agent_1.HttpAgent({ ...options === null || options === void 0 ? void 0 : options.agentOptions });
    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV !== "production") {
        agent.fetchRootKey().catch(err => {
            console.error("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
        });
    }
    // Creates an actor with using the candid interface and the HttpAgent
    return agent_1.Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options === null || options === void 0 ? void 0 : options.actorOptions,
    });
};
/**
 *
 * @param {string} canisterId
 * @param {import("@dfinity/agent").Identity} identity
 * @param {string} host
 * @return {import("@dfinity/agent").ActorSubclass<import("./canistergeek.did.d.ts")._SERVICE>}
 */
const createCanisterActor = (canisterId, identity, host) => {
    return createActor(canisterId, {
        agentOptions: {
            identity: identity,
            host: host
        }
    });
};
exports.createCanisterActor = createCanisterActor;
//# sourceMappingURL=canistergeek.js.map