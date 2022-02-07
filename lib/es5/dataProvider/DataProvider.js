"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProvider = exports.useDataContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const use_custom_compare_1 = require("use-custom-compare");
const CanistergeekService_1 = require("../api/CanistergeekService");
const react_dom_1 = require("react-dom");
const lodash_1 = __importDefault(require("lodash"));
const isMounted_1 = __importDefault(require("../util/isMounted"));
const typescriptAddons_1 = require("../util/typescriptAddons");
const principal_1 = require("@dfinity/principal");
const initialContextValue = {
    status: {},
    error: {},
    dataHourly: {},
    dataDaily: {},
    dataBlackhole: {},
    getCanisterMetrics: () => undefined,
    collectCanisterMetrics: () => Promise.resolve(),
};
const Context = React.createContext(initialContextValue);
const useDataContext = () => React.useContext(Context);
exports.useDataContext = useDataContext;
const DataProvider = (props) => {
    const isMounted = (0, isMounted_1.default)();
    const [contextStatus, updateContextStatus] = (0, react_1.useReducer)((state, newState) => {
        const result = { ...state };
        lodash_1.default.each(newState, (value, key) => {
            result[key] = {
                ...result[key],
                ...value
            };
        });
        return result;
    }, initialContextValue.status);
    const [contextError, updateContextError] = (0, react_1.useReducer)((state, newState) => {
        const result = { ...state };
        lodash_1.default.each(newState, (value, key) => {
            result[key] = {
                ...result[key],
                ...value
            };
        });
        return result;
    }, initialContextValue.error);
    const [contextDataDaily, updateContextDataDaily] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), initialContextValue.dataDaily);
    const [contextDataHourly, updateContextDataHourly] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), initialContextValue.dataHourly);
    const [contextDataBlackhole, updateContextDataBlackhole] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), initialContextValue.dataBlackhole);
    const getCanisterMetrics = (0, react_1.useCallback)(async (params) => {
        params = lodash_1.default.compact(params);
        const get = async () => {
            updateContextStatus(lodash_1.default.mapValues(lodash_1.default.mapKeys(params, (v) => {
                return v.canisterId;
            }), () => ({ inProgress: true })));
            try {
                const promises = lodash_1.default.map(params, (v) => {
                    if (v.source == "canister") {
                        switch (v.granularity) {
                            case "hourly":
                                return fetchCanisterHourlyDataAndUpdateState(v, props.identity, props.host);
                            case "daily":
                                return fetchCanisterDailyDataAndUpdateState(v, props.identity, props.host);
                        }
                    }
                    else if (v.source == "blackhole") {
                        return fetchCanisterBlackholeDataAndUpdateState(v, props.identity);
                    }
                    return Promise.reject(undefined);
                });
                const allSettledResult = await Promise.allSettled(promises);
                console.log("allSettledResult", lodash_1.default.cloneDeep(allSettledResult));
                const canisterStatusResult = {};
                const canisterErrorResult = {};
                const contextDataHourlyResult = {};
                const contextDataDailyResult = {};
                const contextDataBlackholeResult = {};
                lodash_1.default.each(allSettledResult, (promiseSettleResult, idx) => {
                    const currentParams = params[idx];
                    const canisterId = currentParams.canisterId;
                    switch (promiseSettleResult.status) {
                        case "fulfilled": {
                            const promiseSettleResultFulfilledValue = promiseSettleResult.value;
                            if (promiseSettleResultFulfilledValue) {
                                if ((0, typescriptAddons_1.hasOwnProperty)(promiseSettleResultFulfilledValue, "hourly")) {
                                    const promiseResult = promiseSettleResultFulfilledValue;
                                    //latest day must be the last in the array
                                    contextDataHourlyResult[canisterId] = lodash_1.default.sortBy(promiseResult.hourly, v => v.timeMillis);
                                }
                                else if ((0, typescriptAddons_1.hasOwnProperty)(promiseSettleResultFulfilledValue, "daily")) {
                                    const promiseResult = promiseSettleResultFulfilledValue;
                                    //latest day must be the last in the array
                                    contextDataDailyResult[canisterId] = lodash_1.default.sortBy(promiseResult.daily, v => v.timeMillis);
                                }
                                else if ((0, typescriptAddons_1.hasOwnProperty)(promiseSettleResultFulfilledValue, "blackhole")) {
                                    const promiseResult = promiseSettleResultFulfilledValue;
                                    contextDataBlackholeResult[canisterId] = promiseResult.blackhole;
                                }
                                canisterStatusResult[canisterId] = { inProgress: false, loaded: true };
                                canisterErrorResult[canisterId] = { error: undefined, isError: false };
                            }
                            break;
                        }
                        case "rejected": {
                            console.error("DataProvider.getCanisterMetrics: rejected", canisterId, currentParams.source, promiseSettleResult.reason);
                            canisterStatusResult[canisterId] = { inProgress: false, loaded: true };
                            canisterErrorResult[canisterId] = { isError: true, error: promiseSettleResult.reason };
                            if (currentParams.source == "canister") {
                                const granularity = currentParams.granularity;
                                switch (granularity) {
                                    case "hourly": {
                                        contextDataHourlyResult[canisterId] = [];
                                        break;
                                    }
                                    case "daily": {
                                        contextDataDailyResult[canisterId] = [];
                                        break;
                                    }
                                }
                            }
                            else if (currentParams.source == "blackhole") {
                                contextDataBlackholeResult[canisterId] = undefined;
                            }
                            break;
                        }
                    }
                });
                (0, react_dom_1.unstable_batchedUpdates)(() => {
                    updateContextStatus(canisterStatusResult);
                    updateContextError(canisterErrorResult);
                    updateContextDataHourly(contextDataHourlyResult);
                    updateContextDataDaily(contextDataDailyResult);
                    updateContextDataBlackhole(contextDataBlackholeResult);
                });
            }
            catch (e) {
                console.error(`DataProvider.getCanisterMetrics failed: caught error`, e);
                (0, react_dom_1.unstable_batchedUpdates)(() => {
                    updateContextStatus(lodash_1.default.mapValues(lodash_1.default.mapKeys(params, v => v.canisterId), () => ({ inProgress: false, loaded: true })));
                    updateContextError(lodash_1.default.mapValues(lodash_1.default.mapKeys(params, v => v.canisterId), () => ({ isError: true, error: e })));
                });
            }
        };
        // noinspection ES6MissingAwait
        get();
    }, [isMounted, props.identity, props.host]);
    const collectCanisterMetrics = (0, react_1.useCallback)(async (params) => {
        try {
            updateContextStatus(lodash_1.default.mapValues(lodash_1.default.mapKeys(params.canisterIds, v => v), () => ({ inProgress: true })));
            const promises = lodash_1.default.map(params.canisterIds, async (canisterId) => {
                const canisterActor = CanistergeekService_1.CanistergeekService.createCanistergeekCanisterActor(canisterId, props.identity, props.host);
                return canisterActor.collectCanisterMetrics();
            });
            const allSettledResult = await Promise.allSettled(promises);
            lodash_1.default.each(allSettledResult, (promiseSettleResult, idx) => {
                if (promiseSettleResult.status == "rejected") {
                    console.error("DataProvider.collectCanisterMetrics: rejected", params.canisterIds[idx], promiseSettleResult.reason);
                }
            });
        }
        catch (e) {
            console.error(`DataProvider.collectCanisterMetrics failed: caught error`, e);
        }
        finally {
            updateContextStatus(lodash_1.default.mapValues(lodash_1.default.mapKeys(params.canisterIds, v => v), () => ({ inProgress: false })));
        }
    }, [isMounted, props.identity, props.host]);
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
        status: contextStatus,
        error: contextError,
        dataHourly: contextDataHourly,
        dataDaily: contextDataDaily,
        dataBlackhole: contextDataBlackhole,
        getCanisterMetrics: getCanisterMetrics,
        collectCanisterMetrics: collectCanisterMetrics,
    }), [
        contextStatus,
        contextError,
        contextDataHourly,
        contextDataDaily,
        contextDataBlackhole,
        getCanisterMetrics,
        collectCanisterMetrics
    ], (prevDeps, nextDeps) => {
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    return React.createElement(Context.Provider, { value: value }, props.children);
};
exports.DataProvider = DataProvider;
const fetchCanisterHourlyDataAndUpdateState = async (params, identity, host) => {
    const canisterActor = CanistergeekService_1.CanistergeekService.createCanistergeekCanisterActor(params.canisterId, identity, host);
    const hourlyData = await canisterActor.getCanisterMetrics({
        granularity: { hourly: null },
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    });
    const canisterHourlyResponse = getHourlyMetricsDataWithCanisterHourlyResponse(hourlyData);
    if (canisterHourlyResponse) {
        return {
            hourly: canisterHourlyResponse
        };
    }
};
const fetchCanisterDailyDataAndUpdateState = async (params, identity, host) => {
    const canisterActor = CanistergeekService_1.CanistergeekService.createCanistergeekCanisterActor(params.canisterId, identity, host);
    const dailyData = await canisterActor.getCanisterMetrics({
        granularity: { daily: null },
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    });
    const canisterDailyResponse = getDailyMetricsWithCanisterDailyResponse(dailyData);
    if (canisterDailyResponse) {
        return {
            daily: canisterDailyResponse
        };
    }
};
const fetchCanisterBlackholeDataAndUpdateState = async (params, identity) => {
    const canisterActor = CanistergeekService_1.CanistergeekService.createBlackholeCanisterActor(identity);
    const canisterData = await canisterActor.canister_status({ canister_id: principal_1.Principal.fromText(params.canisterId) });
    return {
        blackhole: {
            cycles: canisterData.cycles,
            memory_size: canisterData.memory_size,
        }
    };
};
const getHourlyMetricsDataWithCanisterHourlyResponse = (canisterResponse) => {
    if (canisterResponse.length == 1) {
        if ("hourly" in canisterResponse[0].data) {
            return canisterResponse[0].data.hourly;
        }
    }
};
const getDailyMetricsWithCanisterDailyResponse = (canisterResponse) => {
    if (canisterResponse.length == 1) {
        if ("daily" in canisterResponse[0].data) {
            return canisterResponse[0].data.daily;
        }
    }
};
//# sourceMappingURL=DataProvider.js.map