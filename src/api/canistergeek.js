import {Actor, HttpAgent} from "@dfinity/agent";

const idlFactory = ({IDL}) => {
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
    const CanisterMetrics = IDL.Record({'data': CanisterMetricsData});
    return IDL.Service({
        'collectCanisterMetrics': IDL.Func([], [], []),
        'getCanisterMetrics': IDL.Func(
            [GetMetricsParameters],
            [IDL.Opt(CanisterMetrics)],
            ['query'],
        ),
    });
};

/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./canistergeek.did.d.ts")._SERVICE>}
 */
const createActor = (canisterId, options) => {
    const agent = new HttpAgent({...options?.agentOptions});

    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV !== "production") {
        agent.fetchRootKey().catch(err => {
            console.error("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
        });
    }

    // Creates an actor with using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};

/**
 *
 * @param {string} canisterId
 * @param {import("@dfinity/agent").Identity} identity
 * @param {string} host
 * @return {import("@dfinity/agent").ActorSubclass<import("./canistergeek.did.d.ts")._SERVICE>}
 */
export const createCanisterActor = (canisterId, identity, host) => {
    return createActor(canisterId, {
        agentOptions: {
            identity: identity,
            host: host
        }
    })
}