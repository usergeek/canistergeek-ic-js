import {ActorConfig, ActorSubclass, HttpAgentOptions} from "@dfinity/agent";
import {IDL} from "@dfinity/candid";

export type CGStatus = {
    inProgress: boolean
    loaded: boolean
}
export type CGStatusByKey = { [key: string]: CGStatus }

export type CGError = {
    isError: boolean
    error?: Error
}
export type CGErrorByKey = { [key: string]: CGError }

export type CreateActorOptions = { agentOptions?: HttpAgentOptions; actorOptions?: ActorConfig }
export type CreateActorFn = <T>(canisterId: string, idlFactory: IDL.InterfaceFactory, options?: CreateActorOptions) => Promise<ActorSubclass<T> | undefined>