import * as React from "react";
import {PropsWithChildren, Reducer, useCallback, useReducer} from "react";
import {CanisterMetrics, DailyMetricsData, HourlyMetricsData} from "../api/canistergeek.did";
import {useCustomCompareMemo} from "use-custom-compare";
import {Identity} from "@dfinity/agent";
import {CanistergeekService} from "../api/CanistergeekService";
import {unstable_batchedUpdates} from "react-dom";
import _ from "lodash"
import {CanisterId} from "./ConfigurationProvider";
import useIsMounted from "../util/isMounted";
import {hasOwnProperty} from "../util/typescriptAddons";

type Granularity = "hourly" | "daily"
export type GetCanisterMetricsFnParams = { canisterId: string, fromMillisUTC: bigint, toMillisUTC: bigint, granularity: Granularity }
type GetCanisterMetricsFn = (params: Array<GetCanisterMetricsFnParams>) => void
type CollectCanisterMetricsFnParams = { canisterIds: Array<string> }
type CollectCanisterMetricsFn = (params: CollectCanisterMetricsFnParams) => Promise<any>

export type ContextDataHourly = { [key: CanisterId]: Array<HourlyMetricsData> }
export type ContextDataDaily = { [key: CanisterId]: Array<DailyMetricsData> }

type ContentStatus = { inProgress: boolean, loaded: boolean }
type CanisterStatus = { [key: CanisterId]: ContentStatus }
type ContentError = { isError: boolean, error?: Error }
export type CanisterError = { [key: CanisterId]: ContentError }

export interface Context {
    status: CanisterStatus
    error: CanisterError
    dataHourly: ContextDataHourly
    dataDaily: ContextDataDaily
    getCanisterMetrics: GetCanisterMetricsFn,
    collectCanisterMetrics: CollectCanisterMetricsFn,
}

const initialContextValue: Context = {
    status: {},
    error: {},
    dataHourly: {},
    dataDaily: {},
    getCanisterMetrics: () => undefined,
    collectCanisterMetrics: () => Promise.resolve(),
}

const Context = React.createContext<Context>(initialContextValue);
export const useDataContext = () => React.useContext<Context>(Context);

type Props = {
    identity?: Identity
    host?: string
}

export const DataProvider = (props: PropsWithChildren<Props>) => {
    const isMounted = useIsMounted()

    const [contextStatus, updateContextStatus] = useReducer<Reducer<CanisterStatus, { [key: CanisterId]: Partial<ContentStatus> }>>(
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
        initialContextValue.status
    )

    const [contextError, updateContextError] = useReducer<Reducer<CanisterError, { [key: CanisterId]: Partial<ContentError> }>>(
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
        initialContextValue.error
    )

    const [contextDataDaily, updateContextDataDaily] = useReducer<Reducer<ContextDataDaily, ContextDataDaily>>(
        (state, newState) => ({...state, ...newState}),
        initialContextValue.dataDaily
    )

    const [contextDataHourly, updateContextDataHourly] = useReducer<Reducer<ContextDataHourly, ContextDataHourly>>(
        (state, newState) => ({...state, ...newState}),
        initialContextValue.dataHourly
    )

    const getCanisterMetrics: GetCanisterMetricsFn = useCallback<GetCanisterMetricsFn>(async (params: Array<GetCanisterMetricsFnParams>) => {
        const get = async () => {
            updateContextStatus(_.mapValues(_.mapKeys(params, v => v.canisterId), () => ({inProgress: true})))
            try {
                const promises: Array<Promise<FetchCanisterHourlyDataPromiseResult | FetchCanisterDailyDataPromiseResult | undefined>> = _.map(params, v => {
                    switch (v.granularity) {
                        case "hourly":
                            return fetchCanisterHourlyDataAndUpdateState(v, props.identity, props.host)
                        case "daily":
                            return fetchCanisterDailyDataAndUpdateState(v, props.identity, props.host)
                    }
                })

                const allSettledResult = await Promise.allSettled(promises)
                console.log("allSettledResult", _.cloneDeep(allSettledResult));
                const canisterStatusResult: { [key: CanisterId]: Partial<ContentStatus> } = {}
                const canisterErrorResult: { [key: CanisterId]: Partial<ContentError> } = {}
                const contextDataHourlyResult: ContextDataHourly = {}
                const contextDataDailyResult: ContextDataDaily = {}

                _.each(allSettledResult, (promiseSettleResult: PromiseSettledResult<FetchCanisterHourlyDataPromiseResult | FetchCanisterDailyDataPromiseResult | undefined>, idx) => {
                    const canisterId = params[idx].canisterId
                    const granularity = params[idx].granularity
                    switch (promiseSettleResult.status) {
                        case "fulfilled": {
                            const promiseSettleResultFulfilledValue: FetchCanisterHourlyDataPromiseResult | FetchCanisterDailyDataPromiseResult | undefined = promiseSettleResult.value;
                            if (promiseSettleResultFulfilledValue) {
                                if (hasOwnProperty(promiseSettleResultFulfilledValue, "hourly")) {
                                    const promiseResult: FetchCanisterHourlyDataPromiseResult = promiseSettleResultFulfilledValue as FetchCanisterHourlyDataPromiseResult
                                    canisterStatusResult[canisterId] = {inProgress: false, loaded: true}
                                    canisterErrorResult[canisterId] = {error: undefined, isError: false}
                                    //latest day must be the last in the array
                                    contextDataHourlyResult[canisterId] = _.sortBy(promiseResult.hourly, v => v.timeMillis)
                                } else if (hasOwnProperty(promiseSettleResultFulfilledValue, "daily")) {
                                    const promiseResult: FetchCanisterDailyDataPromiseResult = promiseSettleResultFulfilledValue as FetchCanisterDailyDataPromiseResult
                                    canisterStatusResult[canisterId] = {inProgress: false, loaded: true}
                                    canisterErrorResult[canisterId] = {error: undefined, isError: false}
                                    //latest day must be the last in the array
                                    contextDataDailyResult[canisterId] = _.sortBy(promiseResult.daily, v => v.timeMillis)
                                }
                            }
                            break;
                        }
                        case "rejected": {
                            console.error("DataProvider.getCanisterMetrics: rejected", canisterId, promiseSettleResult.reason);
                            canisterStatusResult[canisterId] = {inProgress: false, loaded: true}
                            canisterErrorResult[canisterId] = {isError: true, error: promiseSettleResult.reason}
                            switch (granularity) {
                                case "hourly": {
                                    contextDataHourlyResult[canisterId] = []
                                    break;
                                }
                                case "daily": {
                                    contextDataDailyResult[canisterId] = []
                                    break;
                                }
                            }
                            break;
                        }

                    }
                })
                unstable_batchedUpdates(() => {
                    updateContextStatus(canisterStatusResult)
                    updateContextError(canisterErrorResult)
                    updateContextDataHourly(contextDataHourlyResult)
                    updateContextDataDaily(contextDataDailyResult)
                })
            } catch (e) {
                console.error(`DataProvider.getCanisterMetrics failed: caught error`, e);
                unstable_batchedUpdates(() => {
                    updateContextStatus(_.mapValues(_.mapKeys(params, v => v.canisterId), () => ({inProgress: false, loaded: true})))
                    updateContextError(_.mapValues(_.mapKeys(params, v => v.canisterId), () => ({isError: true, error: e})))
                })
            }
        }
        // noinspection ES6MissingAwait
        get();
    }, [isMounted, props.identity, props.host])

    const collectCanisterMetrics: CollectCanisterMetricsFn = useCallback<CollectCanisterMetricsFn>(async (params: CollectCanisterMetricsFnParams): Promise<any> => {
        try {
            updateContextStatus(_.mapValues(_.mapKeys(params.canisterIds, v => v), () => ({inProgress: true})))
            const promises: Array<Promise<any>> = _.map<string, Promise<any>>(params.canisterIds, async (canisterId) => {
                const canisterActor = CanistergeekService.createCanisterActor(canisterId, props.identity, props.host);
                return canisterActor.collectCanisterMetrics()
            })
            const allSettledResult = await Promise.allSettled(promises)
            _.each(allSettledResult, (promiseSettleResult: PromiseSettledResult<any>, idx) => {
                if (promiseSettleResult.status == "rejected") {
                    console.error("DataProvider.collectCanisterMetrics: rejected", params.canisterIds[idx], promiseSettleResult.reason);
                }
            })
        } catch (e) {
            console.error(`DataProvider.collectCanisterMetrics failed: caught error`, e);
        } finally {
            updateContextStatus(_.mapValues(_.mapKeys(params.canisterIds, v => v), () => ({inProgress: false})))
        }
    }, [isMounted, props.identity, props.host])

    const value = useCustomCompareMemo<Context, [CanisterStatus, CanisterError, ContextDataHourly, ContextDataDaily, GetCanisterMetricsFn, CollectCanisterMetricsFn]>(() => ({
        status: contextStatus,
        error: contextError,
        dataHourly: contextDataHourly,
        dataDaily: contextDataDaily,
        getCanisterMetrics: getCanisterMetrics,
        collectCanisterMetrics: collectCanisterMetrics,
    }), [
        contextStatus,
        contextError,
        contextDataHourly,
        contextDataDaily,
        getCanisterMetrics,
        collectCanisterMetrics
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <Context.Provider value={value}>
        {props.children}
    </Context.Provider>
}

////////////////////////////////////////////////
// Private
////////////////////////////////////////////////

type FetchCanisterHourlyDataPromiseResult = {
    "hourly": Array<HourlyMetricsData>
}
const fetchCanisterHourlyDataAndUpdateState = async (params: GetCanisterMetricsFnParams, identity?: Identity, host?: string): Promise<FetchCanisterHourlyDataPromiseResult | undefined> => {
    const canisterActor = CanistergeekService.createCanisterActor(params.canisterId, identity, host);
    const hourlyData = await canisterActor.getCanisterMetrics({
        granularity: {hourly: null},
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    })
    const canisterHourlyResponse: Array<HourlyMetricsData> | undefined = getHourlyMetricsDataWithCanisterHourlyResponse(hourlyData);
    if (canisterHourlyResponse) {
        return {
            hourly: canisterHourlyResponse
        }
    }
}

type FetchCanisterDailyDataPromiseResult = {
    "daily": Array<DailyMetricsData>
}
const fetchCanisterDailyDataAndUpdateState = async (params: GetCanisterMetricsFnParams, identity?: Identity, host?: string): Promise<FetchCanisterDailyDataPromiseResult | undefined> => {
    const canisterActor = CanistergeekService.createCanisterActor(params.canisterId, identity, host);
    const dailyData = await canisterActor.getCanisterMetrics({
        granularity: {daily: null},
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    })
    const canisterDailyResponse: Array<DailyMetricsData> | undefined = getDailyMetricsWithCanisterDailyResponse(dailyData);
    if (canisterDailyResponse) {
        return {
            daily: canisterDailyResponse
        }
    }
}

const getHourlyMetricsDataWithCanisterHourlyResponse = (canisterResponse: [] | [CanisterMetrics]): Array<HourlyMetricsData> | undefined => {
    if (canisterResponse.length == 1) {
        if ("hourly" in canisterResponse[0].data) {
            return canisterResponse[0].data.hourly
        }
    }
}
const getDailyMetricsWithCanisterDailyResponse = (canisterResponse: [] | [CanisterMetrics]): Array<DailyMetricsData> | undefined => {
    if (canisterResponse.length == 1) {
        if ("daily" in canisterResponse[0].data) {
            return canisterResponse[0].data.daily
        }
    }
}