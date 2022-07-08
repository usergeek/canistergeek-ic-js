import * as React from "react";
import {PropsWithChildren, Reducer, useCallback, useReducer} from "react";
import {CanisterId} from "./ConfigurationProvider";
import {HttpAgent, Identity} from "@dfinity/agent";
import _ from "lodash"
import useIsMounted from "../util/isMounted";
import {CanistergeekService, getCandidOptional} from "../api/CanistergeekService";
import {_SERVICE, CanisterLogMessages, CanisterLogRequest, CanisterLogResponse, GetLatestLogMessagesParameters, GetLogMessagesFilter, GetLogMessagesParameters, LogMessagesData, Nanos} from "../api/canistergeek.did";
import {DistributiveOmit, hasOwnProperty} from "../util/typescriptAddons";
import {unstable_batchedUpdates} from "react-dom";
import {useCustomCompareMemo} from "use-custom-compare";
import {CGError, CGErrorByKey, CGStatus, CGStatusByKey} from "./Commons";

////////////////////////////////////////////////
// MessagesInfo
////////////////////////////////////////////////

export type InfoData = {
    lastTimeNanos?: Nanos
    count: number,
    firstTimeNanos?: Nanos
}
export type InfoDataByCanister = { [key: CanisterId]: InfoData | undefined }

type GetInfosFn = (canisterIds: Array<CanisterId>) => void

////////////////////////////////////////////////
// LogMessages
////////////////////////////////////////////////

type GetLogMessagesRequestType = "messages" | "lastMessages"
type GetLogMessagesCanisterContextCommon<S extends GetLogMessagesRequestType = GetLogMessagesRequestType> = {
    canisterId: string
    requestType: S
}
export type GetLogMessagesCanisterContextMessages = GetLogMessagesCanisterContextCommon<"messages"> & { parameters: GetLogMessagesParameters }
export type GetLogMessagesCanisterContextLatestMessages = GetLogMessagesCanisterContextCommon<"lastMessages"> & { parameters: GetLatestLogMessagesParameters }
export type GetLogMessagesCanisterContext = GetLogMessagesCanisterContextMessages | GetLogMessagesCanisterContextLatestMessages
export type GetLogMessagesFnResultListItem = {
    canisterId: string
    logMessagesData: LogMessagesData
}
export type GetLogMessagesFnResult = {
    errorsByCanister: CGErrorByKey
    listItems: Array<GetLogMessagesFnResultListItem>
    lastAnalyzedMessageTimeNanos: Nanos | undefined
}
export type GetLogMessagesFnParameters<T = GetLogMessagesCanisterContext> = {
    canisters: Array<T>
    sortItemsBy: (item: GetLogMessagesFnResultListItem) => any
}
export type GetLogMessagesFn = (parameters: GetLogMessagesFnParameters) => Promise<GetLogMessagesFnResult>

export interface Context {
    infoStatus: CGStatusByKey
    infoError: CGErrorByKey
    infoData: InfoDataByCanister

    getInfos: GetInfosFn
    getLogMessages: GetLogMessagesFn
}

const initialContextValue: Context = {
    infoStatus: {},
    infoError: {},
    infoData: {},
    getInfos: () => null,
    getLogMessages: () => null,
}

const LogMessagesDataContext = React.createContext<Context | undefined>(undefined);
export const useLogMessagesDataContext = () => {
    const context = React.useContext<Context | undefined>(LogMessagesDataContext);
    if (!context) {
        throw new Error("useLogMessagesDataContext must be used within a LogMessagesDataContext.Provider")
    }
    return context;
}

type Props = {
    identity?: Identity
    host?: string
    httpAgent?: HttpAgent
}

export const LogMessagesDataProvider = (props: PropsWithChildren<Props>) => {
    const isMounted = useIsMounted()

    const [infoStatusByCanister, updateInfoStatusByCanister] = useReducer<Reducer<CGStatusByKey, { [key: CanisterId]: Partial<CGStatus> }>>(
        (state, newState) => {
            const result = {...state}
            _.each(newState, (value, key) => {
                result[key] = {
                    ...result[key],
                    ...value
                }
            })
            return result
        },
        initialContextValue.infoStatus
    )

    const [infoErrorByCanister, updateInfoErrorByCanister] = useReducer<Reducer<CGErrorByKey, { [key: CanisterId]: Partial<CGError> }>>(
        (state, newState) => {
            const result = {...state}
            _.each(newState, (value, key) => {
                result[key] = {
                    ...result[key],
                    ...value
                }
            })
            return result
        },
        initialContextValue.infoError
    )

    const [infoDataByCanister, updateInfoDataByCanister] = useReducer<Reducer<InfoDataByCanister, InfoDataByCanister>>(
        (state, newState) => ({...state, ...newState}),
        initialContextValue.infoData
    )

    const getInfos: GetInfosFn = useCallback<GetInfosFn>(async (canisterIds: Array<CanisterId>): Promise<any> => {
        try {
            updateInfoStatusByCanister(_.mapValues(_.mapKeys(canisterIds, v => v), () => ({inProgress: true})))

            const promises: Array<Promise<InfoData | undefined>> = _.map(canisterIds, (canisterId) => fetchCanisterInfo(canisterId, props.identity, props.host, props.httpAgent))
            const allSettledResult = await Promise.allSettled(promises)
            console.log("allSettledResult", _.cloneDeep(allSettledResult));

            const infoStatusByCanisterResult: { [key: CanisterId]: Partial<CGStatus> } = {}
            const infoErrorByCanisterResult: { [key: CanisterId]: Partial<CGError> } = {}
            const infoDataByCanisterResult: InfoDataByCanister = {}

            _.each(allSettledResult, (promiseSettleResult: PromiseSettledResult<InfoData | undefined>, idx) => {
                const canisterId = canisterIds[idx]
                switch (promiseSettleResult.status) {
                    case "fulfilled": {
                        infoStatusByCanisterResult[canisterId] = {inProgress: false, loaded: true}
                        infoErrorByCanisterResult[canisterId] = {error: undefined, isError: false}
                        infoDataByCanisterResult[canisterId] = promiseSettleResult.value
                        break;
                    }
                    case "rejected": {
                        console.error("LogMessagesDataProvider.getLogInfos: rejected", canisterId, promiseSettleResult.reason);
                        infoStatusByCanisterResult[canisterId] = {inProgress: false, loaded: true}
                        infoErrorByCanisterResult[canisterId] = {isError: true, error: promiseSettleResult.reason}
                        infoDataByCanisterResult[canisterId] = undefined
                        break;
                    }
                }
            })
            unstable_batchedUpdates(() => {
                updateInfoStatusByCanister(infoStatusByCanisterResult)
                updateInfoErrorByCanister(infoErrorByCanisterResult)
                updateInfoDataByCanister(infoDataByCanisterResult)
            })
        } catch (e) {
            console.error(`DataProvider.getInfos failed: caught error`, e);
            unstable_batchedUpdates(() => {
                updateInfoStatusByCanister(_.mapValues(_.mapKeys(canisterIds, v => v), () => ({inProgress: false, loaded: true})))
                updateInfoErrorByCanister(_.mapValues(_.mapKeys(canisterIds, v => v), () => ({isError: true, error: e})))
            })
        }
    }, [isMounted, props.identity, props.host, props.httpAgent])

    const getLogMessages: GetLogMessagesFn = useCallback<GetLogMessagesFn>(async (parameters: GetLogMessagesFnParameters): Promise<GetLogMessagesFnResult> => {
        const promises: Array<Promise<GetCanisterLogRecursiveResult>> = _.map<GetLogMessagesCanisterContext, Promise<GetCanisterLogRecursiveResult>>(parameters.canisters, async (canisterContext: GetLogMessagesCanisterContext) => {
            const canisterActor: _SERVICE = CanistergeekService.createCanistergeekCanisterActor(canisterContext.canisterId, props.identity, props.host, props.httpAgent);
            if (canisterContext.requestType == "messages") {
                return getCanisterLogRecursive(canisterContext.canisterId, canisterActor, {getMessages: canisterContext.parameters})
            } else if (canisterContext.requestType == "lastMessages") {
                return getCanisterLogRecursive(canisterContext.canisterId, canisterActor, {getLatestMessages: canisterContext.parameters})
            }
            // @ts-ignore
            return Promise.reject(Error(`Unsupported requestType "${canisterContext.requestType}"`))
        })

        const errorsByCanister: CGErrorByKey = {}
        let listItems: Array<GetLogMessagesFnResultListItem> = []

        const allSettledResult = await Promise.allSettled(promises)
        let targetChunkSize: number = 0;
        _.each(allSettledResult, (promiseSettleResult: PromiseSettledResult<GetCanisterLogRecursiveResult>, idx) => {
            const canisterId = parameters.canisters[idx].canisterId;
            if (promiseSettleResult.status == "rejected") {
                console.error("getLogMessages: rejected", canisterId, promiseSettleResult.reason);
                errorsByCanister[canisterId] = {error: promiseSettleResult.reason, isError: true}
            } else {
                errorsByCanister[canisterId] = {error: undefined, isError: false}
                targetChunkSize = promiseSettleResult.value.targetMaxCount
                const loggerResponse: CanisterLogResponse | undefined = getCandidOptional<CanisterLogResponse>(promiseSettleResult.value.messagesResult);
                if (loggerResponse && hasOwnProperty(loggerResponse, "messages")) {
                    const logMessages: CanisterLogMessages = loggerResponse.messages
                    _.each(logMessages.data, (logMessagesData) => {
                        listItems.push({
                            canisterId: canisterId,
                            logMessagesData: logMessagesData
                        })
                    })
                }
            }
        })
        const sortedItems = _.sortBy(listItems, parameters.sortItemsBy);
        listItems = _.take(sortedItems, targetChunkSize)
        const lastAnalyzedMessageTimeNanos: Nanos | undefined = _.last(listItems)?.logMessagesData.timeNanos
        return {
            errorsByCanister: errorsByCanister,
            listItems: listItems,
            lastAnalyzedMessageTimeNanos: lastAnalyzedMessageTimeNanos,
        }
    }, [isMounted, props.identity, props.host, props.httpAgent])

    const value = useCustomCompareMemo<Context, [CGStatusByKey, CGErrorByKey, InfoDataByCanister, GetInfosFn, GetLogMessagesFn]>(() => ({
        infoStatus: infoStatusByCanister,
        infoError: infoErrorByCanister,
        infoData: infoDataByCanister,
        getInfos: getInfos,
        getLogMessages: getLogMessages,
    }), [
        infoStatusByCanister,
        infoErrorByCanister,
        infoDataByCanister,
        getInfos,
        getLogMessages,
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <LogMessagesDataContext.Provider value={value}>
        {props.children}
    </LogMessagesDataContext.Provider>
}

const fetchCanisterInfo = async (canisterId: CanisterId, identity?: Identity, host?: string, httpAgent?: HttpAgent): Promise<InfoData | undefined> => {
    const canisterActor: _SERVICE = CanistergeekService.createCanistergeekCanisterActor(canisterId, identity, host, httpAgent);
    let result: [] | [CanisterLogResponse] = [];
    try {
        result = await canisterActor.getCanisterLog([{getMessagesInfo: null}]);
    } catch (e) {
        return Promise.reject(e)
    }
    if (result.length === 1) {
        const loggerResponse: CanisterLogResponse = result[0];
        if (hasOwnProperty(loggerResponse, "messagesInfo")) {
            const info = loggerResponse.messagesInfo;
            return {
                count: info.count,
                firstTimeNanos: info.firstTimeNanos.length === 1 ? info.firstTimeNanos[0] : undefined,
                lastTimeNanos: info.lastTimeNanos.length === 1 ? info.lastTimeNanos[0] : undefined,
            };
        }
    }
    return undefined
}

type GetCanisterLogRecursiveRequest = DistributiveOmit<CanisterLogRequest, "getMessagesInfo">
type GetCanisterLogRecursiveResponse = DistributiveOmit<CanisterLogResponse, "messagesInfo">

const GET_LOG_MESSAGES_MAX_COUNT = 100
const GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST = 50
const GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT = 25
const GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST = 25

type GetCanisterLogRecursiveResult = {
    messagesResult: [] | [GetCanisterLogRecursiveResponse]
    targetMaxCount: number
}

const getCanisterLogRecursive = async (canisterId: string, canisterActor: _SERVICE, request: GetCanisterLogRecursiveRequest): Promise<GetCanisterLogRecursiveResult> => {
    let messagesResult: CanisterLogMessages = {
        data: [],
        lastAnalyzedMessageTimeNanos: []
    }

    let originalCount: number = 0
    let originalFilter: GetLogMessagesFilter | undefined = undefined
    if (hasOwnProperty(request, "getMessages")) {
        originalCount = request.getMessages.count
        originalFilter = getCandidOptional(request.getMessages.filter)
    } else if (hasOwnProperty(request, "getLatestMessages")) {
        originalCount = request.getLatestMessages.count
        originalFilter = getCandidOptional(request.getLatestMessages.filter)
    }

    let targetMaxCount = Math.min(originalCount, GET_LOG_MESSAGES_MAX_COUNT)
    if (originalFilter) {
        targetMaxCount = Math.min(originalCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT)
    }

    if (hasOwnProperty(request, "getMessages")) {
        request.getMessages.count = Math.min(targetMaxCount, GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST)
        if (originalFilter) {
            originalFilter.analyzeCount = Math.min(targetMaxCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST)
            request.getMessages.filter = [originalFilter]
        }
    } else if (hasOwnProperty(request, "getLatestMessages")) {
        request.getLatestMessages.count = Math.min(targetMaxCount, GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST)
        if (originalFilter) {
            originalFilter.analyzeCount = Math.min(targetMaxCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST)
            request.getLatestMessages.filter = [originalFilter]
        }
    }

    while (true) {
        const getCanisterLogResult = await canisterActor.getCanisterLog([request]);
        const loggerResponse: CanisterLogResponse | undefined = getCandidOptional<CanisterLogResponse>(getCanisterLogResult);
        if (loggerResponse && hasOwnProperty(loggerResponse, "messages")) {
            const logMessages: CanisterLogMessages = loggerResponse.messages
            messagesResult.data = [
                ...messagesResult.data,
                ...logMessages.data
            ]
            const lastAnalyzedMessageTimeNanos: Nanos | undefined = getCandidOptional(logMessages.lastAnalyzedMessageTimeNanos);
            if (!_.isNil(lastAnalyzedMessageTimeNanos)) {
                if (hasOwnProperty(request, "getMessages")) {
                    request.getMessages.fromTimeNanos = [lastAnalyzedMessageTimeNanos]
                    messagesResult.lastAnalyzedMessageTimeNanos = [lastAnalyzedMessageTimeNanos]
                    if (messagesResult.data.length < targetMaxCount) {
                        let messagesToFetchLeft = targetMaxCount - messagesResult.data.length;
                        if (messagesToFetchLeft < request.getMessages.count) {
                            request.getMessages.count = messagesToFetchLeft
                        }
                        continue
                    }
                } else if (hasOwnProperty(request, "getLatestMessages")) {
                    request.getLatestMessages.upToTimeNanos = [lastAnalyzedMessageTimeNanos]
                    messagesResult.lastAnalyzedMessageTimeNanos = [lastAnalyzedMessageTimeNanos]
                    if (messagesResult.data.length < targetMaxCount) {
                        let messagesToFetchLeft = targetMaxCount - messagesResult.data.length;
                        if (messagesToFetchLeft < request.getLatestMessages.count) {
                            request.getLatestMessages.count = messagesToFetchLeft
                        }
                        continue
                    }
                }
            }
        }
        break;
    }
    return {
        messagesResult: [{
            messages: messagesResult
        }],
        targetMaxCount: targetMaxCount
    }
}