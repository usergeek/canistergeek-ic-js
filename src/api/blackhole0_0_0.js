/**
 * https://github.com/ninegua/ic-blackhole
 */

import {Actor, HttpAgent} from "@dfinity/agent";

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

const CANISTER_ID = "e3mmv-5qaaa-aaaah-aadma-cai"

/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
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
 * @param {import("@dfinity/agent").Identity} identity
 * @return {import("@dfinity/agent").ActorSubclass<import("./blackhole0_0_0.did.d.ts")._SERVICE>}
 */
export const createCanisterActor = (identity) => {
    return createActor(CANISTER_ID, {
        agentOptions: {
            identity: identity,
        }
    })
}