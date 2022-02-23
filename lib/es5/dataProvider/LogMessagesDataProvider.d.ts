import { PropsWithChildren } from "react";
import { CanisterId } from "./ConfigurationProvider";
import { Identity } from "@dfinity/agent";
import { GetLatestLogMessagesParameters, GetLogMessagesParameters, LogMessagesData, Nanos } from "../api/canistergeek.did";
import { CGErrorByKey, CGStatusByKey } from "./Commons";
export declare type InfoData = {
    lastTimeNanos?: Nanos;
    count: number;
    firstTimeNanos?: Nanos;
};
export declare type InfoDataByCanister = {
    [key: CanisterId]: InfoData | undefined;
};
declare type GetInfosFn = (canisterIds: Array<CanisterId>) => void;
declare type GetLogMessagesRequestType = "messages" | "lastMessages";
declare type GetLogMessagesCanisterContextCommon<S extends GetLogMessagesRequestType = GetLogMessagesRequestType> = {
    canisterId: string;
    requestType: S;
};
export declare type GetLogMessagesCanisterContextMessages = GetLogMessagesCanisterContextCommon<"messages"> & {
    parameters: GetLogMessagesParameters;
};
export declare type GetLogMessagesCanisterContextLatestMessages = GetLogMessagesCanisterContextCommon<"lastMessages"> & {
    parameters: GetLatestLogMessagesParameters;
};
export declare type GetLogMessagesCanisterContext = GetLogMessagesCanisterContextMessages | GetLogMessagesCanisterContextLatestMessages;
export declare type GetLogMessagesFnResultListItem = {
    canisterId: string;
    logMessagesData: LogMessagesData;
};
export declare type GetLogMessagesFnResult = {
    errorsByCanister: CGErrorByKey;
    listItems: Array<GetLogMessagesFnResultListItem>;
    lastAnalyzedMessageTimeNanos: Nanos | undefined;
};
export declare type GetLogMessagesFnParameters<T = GetLogMessagesCanisterContext> = {
    canisters: Array<T>;
    sortItemsBy: (item: GetLogMessagesFnResultListItem) => any;
};
export declare type GetLogMessagesFn = (parameters: GetLogMessagesFnParameters) => Promise<GetLogMessagesFnResult>;
export interface Context {
    infoStatus: CGStatusByKey;
    infoError: CGErrorByKey;
    infoData: InfoDataByCanister;
    getInfos: GetInfosFn;
    getLogMessages: GetLogMessagesFn;
}
export declare const useLogMessagesDataContext: () => Context;
declare type Props = {
    identity?: Identity;
    host?: string;
};
export declare const LogMessagesDataProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export {};
