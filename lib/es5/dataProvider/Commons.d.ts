import { ActorConfig, ActorSubclass, HttpAgentOptions } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
export declare type CGStatus = {
    inProgress: boolean;
    loaded: boolean;
};
export declare type CGStatusByKey = {
    [key: string]: CGStatus;
};
export declare type CGError = {
    isError: boolean;
    error?: Error;
};
export declare type CGErrorByKey = {
    [key: string]: CGError;
};
export declare type CreateActorOptions = {
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
};
export declare type CreateActorFn = <T>(canisterId: string, idlFactory: IDL.InterfaceFactory, options?: CreateActorOptions) => Promise<ActorSubclass<T> | undefined>;
