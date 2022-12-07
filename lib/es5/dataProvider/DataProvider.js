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
const canistergeek_1 = require("../api/canistergeek");
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
                                return fetchCanisterHourlyDataAndUpdateState(v, props.createActorFn, props.identity, props.host);
                            case "daily":
                                return fetchCanisterDailyDataAndUpdateState(v, props.createActorFn, props.identity, props.host);
                        }
                    }
                    else if (v.source == "blackhole") {
                        return fetchCanisterBlackholeDataAndUpdateState(v);
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
                                        contextDataHourlyResult[canisterId] = undefined;
                                        break;
                                    }
                                    case "daily": {
                                        contextDataDailyResult[canisterId] = undefined;
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
    }, [isMounted, props.identity, props.host, props.createActorFn]);
    const collectCanisterMetrics = (0, react_1.useCallback)(async (params) => {
        try {
            updateContextStatus(lodash_1.default.mapValues(lodash_1.default.mapKeys(params.canisterIds, v => v), () => ({ inProgress: true })));
            const promises = lodash_1.default.map(params.canisterIds, async (canisterId) => {
                const canisterActor = await props.createActorFn(canisterId, canistergeek_1.idlFactory, {
                    agentOptions: {
                        identity: props.identity,
                        host: props.host
                    }
                });
                return CanistergeekAPIHelper.collectCanisterMetrics(canisterActor, params.collectMetricsType || "normal");
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
    }, [isMounted, props.identity, props.host, props.createActorFn]);
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
const fetchCanisterHourlyDataAndUpdateState = async (params, createActorFn, identity, host) => {
    const canisterActor = await createActorFn(params.canisterId, canistergeek_1.idlFactory, {
        agentOptions: {
            identity: identity,
            host: host
        }
    });
    const parameters = {
        granularity: { hourly: null },
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    };
    const hourlyData = await CanistergeekAPIHelper.getCanisterMetrics(canisterActor, parameters);
    const canisterHourlyResponse = getHourlyMetricsDataWithCanisterHourlyResponse(hourlyData);
    if (canisterHourlyResponse) {
        return {
            hourly: canisterHourlyResponse
        };
    }
};
const fetchCanisterDailyDataAndUpdateState = async (params, createActorFn, identity, host) => {
    const canisterActor = await createActorFn(params.canisterId, canistergeek_1.idlFactory, {
        agentOptions: {
            identity: identity,
            host: host
        }
    });
    const parameters = {
        granularity: { daily: null },
        dateFromMillis: params.fromMillisUTC,
        dateToMillis: params.toMillisUTC
    };
    const dailyData = await CanistergeekAPIHelper.getCanisterMetrics(canisterActor, parameters);
    const canisterDailyResponse = getDailyMetricsWithCanisterDailyResponse(dailyData);
    if (canisterDailyResponse) {
        return {
            daily: canisterDailyResponse
        };
    }
};
const fetchCanisterBlackholeDataAndUpdateState = async (params) => {
    const canisterActor = CanistergeekService_1.CanistergeekService.createBlackholeCanisterActor();
    const canisterData = await canisterActor.canister_status({ canister_id: principal_1.Principal.fromText(params.canisterId) });
    return {
        blackhole: {
            cycles: canisterData.cycles,
            memory_size: canisterData.memory_size,
        }
    };
};
const getHourlyMetricsDataWithCanisterHourlyResponse = (canisterResponse) => {
    const value = (0, CanistergeekService_1.getCandidOptional)(canisterResponse);
    if (value) {
        if ((0, typescriptAddons_1.hasOwnProperty)(value.data, "hourly")) {
            return value.data.hourly;
        }
    }
};
const getDailyMetricsWithCanisterDailyResponse = (canisterResponse) => {
    const value = (0, CanistergeekService_1.getCandidOptional)(canisterResponse);
    if (value) {
        if ((0, typescriptAddons_1.hasOwnProperty)(value.data, "daily")) {
            return value.data.daily;
        }
    }
};
const CanistergeekAPIHelper = (() => {
    const SUPPORTED_VERSION = 1;
    const getCanisterSupportedVersion = (getInformationResponse) => {
        return (0, CanistergeekService_1.getCandidOptional)(getInformationResponse.version);
    };
    const ifCanisterSupportsVersion = (canisterVersion, version) => {
        if (canisterVersion != undefined) {
            return canisterVersion == BigInt(version);
        }
        return false;
    };
    const getCanisterMetrics = async (canisterActor, parameters) => {
        try {
            //trying to get version and metrics
            const metricsRequest = { parameters: parameters };
            const request = { version: true, status: [], metrics: [metricsRequest], };
            const getCanistergeekInformationResponse = await canisterActor.getCanistergeekInformation(request);
            const canisterSupportedVersion = getCanisterSupportedVersion(getCanistergeekInformationResponse);
            if (ifCanisterSupportsVersion(canisterSupportedVersion, SUPPORTED_VERSION)) {
                const metricsResponse = (0, CanistergeekService_1.getCandidOptional)(getCanistergeekInformationResponse.metrics);
                return (0, CanistergeekService_1.createCandidOptional)((0, CanistergeekService_1.getCandidOptional)(metricsResponse === null || metricsResponse === void 0 ? void 0 : metricsResponse.metrics));
            }
            else {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Unsupported version (canister has ${canisterSupportedVersion}, expected ${SUPPORTED_VERSION})`);
            }
        }
        catch (e) {
            /*
            error might be:
            - cannot find method "getCanistergeekInformation" in canister - if it is the case - we have to try legacy method
            - any other error - throw the error up
            */
            const canisterResponseQueryError = CanistergeekService_1.ICCanisterResponseUtil.parseICCanisterResponseQueryError(e);
            if (canisterResponseQueryError != undefined && CanistergeekService_1.ICCanisterResponseUtil.isICCanisterResponseQueryError_NoMethod(canisterResponseQueryError)) {
                console.log(`CanistergeekAPIHelper.getCanisterMetrics: fallback to legacy method getCanisterMetrics()...`);
                const metrics = await canisterActor.getCanisterMetrics(parameters);
                return metrics;
            }
            console.error(`CanistergeekAPIHelper.getCanisterMetrics: caught error`, e);
            throw e;
        }
    };
    const collectCanisterMetrics = async (canisterActor, collectMetricsType) => {
        try {
            const request = { version: true, status: [], metrics: [] };
            const getCanistergeekInformationResponse = await canisterActor.getCanistergeekInformation(request);
            const canisterSupportedVersion = getCanisterSupportedVersion(getCanistergeekInformationResponse);
            if (ifCanisterSupportsVersion(canisterSupportedVersion, SUPPORTED_VERSION)) {
                const collectMetricsRequestType = { [collectMetricsType]: null };
                await canisterActor.updateCanistergeekInformation({ metrics: [collectMetricsRequestType] });
                return undefined;
            }
            console.warn(`CanistergeekAPIHelper.collectCanisterMetrics: Unsupported version (canister has ${canisterSupportedVersion}, expected ${SUPPORTED_VERSION})`);
            return undefined;
        }
        catch (e) {
            let tryLegacy = false;
            const canisterResponseQueryError = CanistergeekService_1.ICCanisterResponseUtil.parseICCanisterResponseQueryError(e);
            const isQueryNoMethodError = canisterResponseQueryError != undefined && CanistergeekService_1.ICCanisterResponseUtil.isICCanisterResponseQueryError_NoMethod(canisterResponseQueryError);
            if (isQueryNoMethodError) {
                tryLegacy = true;
            }
            else {
                const canisterResponseCallError = CanistergeekService_1.ICCanisterResponseUtil.parseICCanisterResponseCallError(e);
                const isCallNoMethodError = canisterResponseCallError != undefined && CanistergeekService_1.ICCanisterResponseUtil.isICCanisterResponseCallError_NoUpdateMethod(canisterResponseCallError);
                if (isCallNoMethodError) {
                    tryLegacy = true;
                }
            }
            if (tryLegacy) {
                console.log(`CanistergeekAPIHelper.collectCanisterMetrics: fallback to legacy method collectCanisterMetrics()...`);
                const legacyCollectCanisterMetricsResponse = await canisterActor.collectCanisterMetrics();
                return legacyCollectCanisterMetricsResponse;
            }
            console.error(`CanistergeekAPIHelper.collectCanisterMetrics: caught error`, e);
            throw e;
        }
    };
    return {
        getCanisterMetrics: getCanisterMetrics,
        collectCanisterMetrics: collectCanisterMetrics
    };
})();
//# sourceMappingURL=DataProvider.js.map