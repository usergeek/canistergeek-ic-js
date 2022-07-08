/**
 * https://github.com/ninegua/ic-blackhole
 */

import {Actor, AnonymousIdentity, HttpAgent} from "@dfinity/agent";

const idlFactory = ({IDL}) => {
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
        'canister_status': IDL.Func(
            [IDL.Record({'canister_id': canister_id})],
            [canister_status],
            [],
        ),
    });
};

export const BLACKHOLE_CANISTER_ID = "e3mmv-5qaaa-aaaah-aadma-cai"

/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
 */
const createActor = (canisterId, options) => {
    const agent = new HttpAgent({...options?.agentOptions});

    // Creates an actor with using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};

/**
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
 */
export const createCanisterActor = () => {
    return createActor(BLACKHOLE_CANISTER_ID, {
        agentOptions: {
            identity: new AnonymousIdentity(),
            host: "https://boundary.ic0.app"
        }
    })
}