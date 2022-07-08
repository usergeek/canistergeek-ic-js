"use strict";
/**
 * https://github.com/ninegua/ic-blackhole
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanisterActor = exports.BLACKHOLE_CANISTER_ID = void 0;
const agent_1 = require("@dfinity/agent");
const idlFactory = ({ IDL }) => {
    const canister_id = IDL.Principal;
    const definite_canister_settings = IDL.Record({
        'freezing_threshold': IDL.Nat,
        'controllers': IDL.Vec(IDL.Principal),
        'memory_allocation': IDL.Nat,
        'compute_allocation': IDL.Nat,
    });
    const canister_status = IDL.Record({
        'status': IDL.Variant({
            'stopped': IDL.Null,
            'stopping': IDL.Null,
            'running': IDL.Null,
        }),
        'memory_size': IDL.Nat,
        'cycles': IDL.Nat,
        'settings': definite_canister_settings,
        'module_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    return IDL.Service({
        'canister_status': IDL.Func([IDL.Record({ 'canister_id': canister_id })], [canister_status], []),
    });
};
exports.BLACKHOLE_CANISTER_ID = "e3mmv-5qaaa-aaaah-aadma-cai";
/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
 */
const createActor = (canisterId, options) => {
    const agent = new agent_1.HttpAgent({ ...options === null || options === void 0 ? void 0 : options.agentOptions });
    // Creates an actor with using the candid interface and the HttpAgent
    return agent_1.Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options === null || options === void 0 ? void 0 : options.actorOptions,
    });
};
/**
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
 */
const createCanisterActor = () => {
    return createActor(exports.BLACKHOLE_CANISTER_ID, {
        agentOptions: {
            identity: new agent_1.AnonymousIdentity(),
            host: "https://boundary.ic0.app"
        }
    });
};
exports.createCanisterActor = createCanisterActor;
//# sourceMappingURL=blackhole0_0_0.js.map