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
exports.LogMessagesDataProvider = exports.useLogMessagesDataContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const lodash_1 = __importDefault(require("lodash"));
const isMounted_1 = __importDefault(require("../util/isMounted"));
const CanistergeekService_1 = require("../api/CanistergeekService");
const typescriptAddons_1 = require("../util/typescriptAddons");
const react_dom_1 = require("react-dom");
const use_custom_compare_1 = require("use-custom-compare");
const initialContextValue = {
    infoStatus: {},
    infoError: {},
    infoData: {},
    getInfos: () => null,
    getLogMessages: () => null,
};
const LogMessagesDataContext = React.createContext(undefined);
const useLogMessagesDataContext = () => {
    const context = React.useContext(LogMessagesDataContext);
    if (!context) {
        throw new Error("useLogMessagesDataContext must be used within a LogMessagesDataContext.Provider");
    }
    return context;
};
exports.useLogMessagesDataContext = useLogMessagesDataContext;
const LogMessagesDataProvider = (props) => {
    const isMounted = (0, isMounted_1.default)();
    const [infoStatusByCanister, updateInfoStatusByCanister] = (0, react_1.useReducer)((state, newState) => {
        const result = { ...state };
        lodash_1.default.each(newState, (value, key) => {
            result[key] = {
                ...result[key],
                ...value
            };
        });
        return result;
    }, initialContextValue.infoStatus);
    const [infoErrorByCanister, updateInfoErrorByCanister] = (0, react_1.useReducer)((state, newState) => {
        const result = { ...state };
        lodash_1.default.each(newState, (value, key) => {
            result[key] = {
                ...result[key],
                ...value
            };
        });
        return result;
    }, initialContextValue.infoError);
    const [infoDataByCanister, updateInfoDataByCanister] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), initialContextValue.infoData);
    const getInfos = (0, react_1.useCallback)(async (canisterIds) => {
        try {
            updateInfoStatusByCanister(lodash_1.default.mapValues(lodash_1.default.mapKeys(canisterIds, v => v), () => ({ inProgress: true })));
            const promises = lodash_1.default.map(canisterIds, (canisterId) => fetchCanisterInfo(canisterId, props.identity, props.host, props.httpAgent));
            const allSettledResult = await Promise.allSettled(promises);
            console.log("allSettledResult", lodash_1.default.cloneDeep(allSettledResult));
            const infoStatusByCanisterResult = {};
            const infoErrorByCanisterResult = {};
            const infoDataByCanisterResult = {};
            lodash_1.default.each(allSettledResult, (promiseSettleResult, idx) => {
                const canisterId = canisterIds[idx];
                switch (promiseSettleResult.status) {
                    case "fulfilled": {
                        infoStatusByCanisterResult[canisterId] = { inProgress: false, loaded: true };
                        infoErrorByCanisterResult[canisterId] = { error: undefined, isError: false };
                        infoDataByCanisterResult[canisterId] = promiseSettleResult.value;
                        break;
                    }
                    case "rejected": {
                        console.error("LogMessagesDataProvider.getLogInfos: rejected", canisterId, promiseSettleResult.reason);
                        infoStatusByCanisterResult[canisterId] = { inProgress: false, loaded: true };
                        infoErrorByCanisterResult[canisterId] = { isError: true, error: promiseSettleResult.reason };
                        infoDataByCanisterResult[canisterId] = undefined;
                        break;
                    }
                }
            });
            (0, react_dom_1.unstable_batchedUpdates)(() => {
                updateInfoStatusByCanister(infoStatusByCanisterResult);
                updateInfoErrorByCanister(infoErrorByCanisterResult);
                updateInfoDataByCanister(infoDataByCanisterResult);
            });
        }
        catch (e) {
            console.error(`DataProvider.getInfos failed: caught error`, e);
            (0, react_dom_1.unstable_batchedUpdates)(() => {
                updateInfoStatusByCanister(lodash_1.default.mapValues(lodash_1.default.mapKeys(canisterIds, v => v), () => ({ inProgress: false, loaded: true })));
                updateInfoErrorByCanister(lodash_1.default.mapValues(lodash_1.default.mapKeys(canisterIds, v => v), () => ({ isError: true, error: e })));
            });
        }
    }, [isMounted, props.identity, props.host, props.httpAgent]);
    const getLogMessages = (0, react_1.useCallback)(async (parameters) => {
        var _a;
        const promises = lodash_1.default.map(parameters.canisters, async (canisterContext) => {
            const canisterActor = CanistergeekService_1.CanistergeekService.createCanistergeekCanisterActor(canisterContext.canisterId, props.identity, props.host, props.httpAgent);
            if (canisterContext.requestType == "messages") {
                return getCanisterLogRecursive(canisterContext.canisterId, canisterActor, { getMessages: canisterContext.parameters });
            }
            else if (canisterContext.requestType == "lastMessages") {
                return getCanisterLogRecursive(canisterContext.canisterId, canisterActor, { getLatestMessages: canisterContext.parameters });
            }
            // @ts-ignore
            return Promise.reject(Error(`Unsupported requestType "${canisterContext.requestType}"`));
        });
        const errorsByCanister = {};
        let listItems = [];
        const allSettledResult = await Promise.allSettled(promises);
        let targetChunkSize = 0;
        lodash_1.default.each(allSettledResult, (promiseSettleResult, idx) => {
            const canisterId = parameters.canisters[idx].canisterId;
            if (promiseSettleResult.status == "rejected") {
                console.error("getLogMessages: rejected", canisterId, promiseSettleResult.reason);
                errorsByCanister[canisterId] = { error: promiseSettleResult.reason, isError: true };
            }
            else {
                errorsByCanister[canisterId] = { error: undefined, isError: false };
                targetChunkSize = promiseSettleResult.value.targetMaxCount;
                const loggerResponse = (0, CanistergeekService_1.getCandidOptional)(promiseSettleResult.value.messagesResult);
                if (loggerResponse && (0, typescriptAddons_1.hasOwnProperty)(loggerResponse, "messages")) {
                    const logMessages = loggerResponse.messages;
                    lodash_1.default.each(logMessages.data, (logMessagesData) => {
                        listItems.push({
                            canisterId: canisterId,
                            logMessagesData: logMessagesData
                        });
                    });
                }
            }
        });
        const sortedItems = lodash_1.default.sortBy(listItems, parameters.sortItemsBy);
        listItems = lodash_1.default.take(sortedItems, targetChunkSize);
        const lastAnalyzedMessageTimeNanos = (_a = lodash_1.default.last(listItems)) === null || _a === void 0 ? void 0 : _a.logMessagesData.timeNanos;
        return {
            errorsByCanister: errorsByCanister,
            listItems: listItems,
            lastAnalyzedMessageTimeNanos: lastAnalyzedMessageTimeNanos,
        };
    }, [isMounted, props.identity, props.host, props.httpAgent]);
    const value = (0, use_custom_compare_1.useCustomCompareMemo)(() => ({
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
        return lodash_1.default.isEqual(prevDeps, nextDeps);
    });
    return React.createElement(LogMessagesDataContext.Provider, { value: value }, props.children);
};
exports.LogMessagesDataProvider = LogMessagesDataProvider;
const fetchCanisterInfo = async (canisterId, identity, host, httpAgent) => {
    const canisterActor = CanistergeekService_1.CanistergeekService.createCanistergeekCanisterActor(canisterId, identity, host, httpAgent);
    let result = [];
    try {
        result = await canisterActor.getCanisterLog([{ getMessagesInfo: null }]);
    }
    catch (e) {
        return Promise.reject(e);
    }
    if (result.length === 1) {
        const loggerResponse = result[0];
        if ((0, typescriptAddons_1.hasOwnProperty)(loggerResponse, "messagesInfo")) {
            const info = loggerResponse.messagesInfo;
            return {
                count: info.count,
                firstTimeNanos: info.firstTimeNanos.length === 1 ? info.firstTimeNanos[0] : undefined,
                lastTimeNanos: info.lastTimeNanos.length === 1 ? info.lastTimeNanos[0] : undefined,
            };
        }
    }
    return undefined;
};
const GET_LOG_MESSAGES_MAX_COUNT = 100;
const GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST = 50;
const GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT = 25;
const GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST = 25;
const getCanisterLogRecursive = async (canisterId, canisterActor, request) => {
    let messagesResult = {
        data: [],
        lastAnalyzedMessageTimeNanos: []
    };
    let originalCount = 0;
    let originalFilter = undefined;
    if ((0, typescriptAddons_1.hasOwnProperty)(request, "getMessages")) {
        originalCount = request.getMessages.count;
        originalFilter = (0, CanistergeekService_1.getCandidOptional)(request.getMessages.filter);
    }
    else if ((0, typescriptAddons_1.hasOwnProperty)(request, "getLatestMessages")) {
        originalCount = request.getLatestMessages.count;
        originalFilter = (0, CanistergeekService_1.getCandidOptional)(request.getLatestMessages.filter);
    }
    let targetMaxCount = Math.min(originalCount, GET_LOG_MESSAGES_MAX_COUNT);
    if (originalFilter) {
        targetMaxCount = Math.min(originalCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT);
    }
    if ((0, typescriptAddons_1.hasOwnProperty)(request, "getMessages")) {
        request.getMessages.count = Math.min(targetMaxCount, GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST);
        if (originalFilter) {
            originalFilter.analyzeCount = Math.min(targetMaxCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST);
            request.getMessages.filter = [originalFilter];
        }
    }
    else if ((0, typescriptAddons_1.hasOwnProperty)(request, "getLatestMessages")) {
        request.getLatestMessages.count = Math.min(targetMaxCount, GET_LOG_MESSAGES_MAX_COUNT_PER_REQUEST);
        if (originalFilter) {
            originalFilter.analyzeCount = Math.min(targetMaxCount, GET_LOG_MESSAGES_WITH_FILTER_MAX_COUNT_PER_REQUEST);
            request.getLatestMessages.filter = [originalFilter];
        }
    }
    while (true) {
        const getCanisterLogResult = await canisterActor.getCanisterLog([request]);
        const loggerResponse = (0, CanistergeekService_1.getCandidOptional)(getCanisterLogResult);
        if (loggerResponse && (0, typescriptAddons_1.hasOwnProperty)(loggerResponse, "messages")) {
            const logMessages = loggerResponse.messages;
            messagesResult.data = [
                ...messagesResult.data,
                ...logMessages.data
            ];
            const lastAnalyzedMessageTimeNanos = (0, CanistergeekService_1.getCandidOptional)(logMessages.lastAnalyzedMessageTimeNanos);
            if (!lodash_1.default.isNil(lastAnalyzedMessageTimeNanos)) {
                if ((0, typescriptAddons_1.hasOwnProperty)(request, "getMessages")) {
                    request.getMessages.fromTimeNanos = [lastAnalyzedMessageTimeNanos];
                    messagesResult.lastAnalyzedMessageTimeNanos = [lastAnalyzedMessageTimeNanos];
                    if (messagesResult.data.length < targetMaxCount) {
                        let messagesToFetchLeft = targetMaxCount - messagesResult.data.length;
                        if (messagesToFetchLeft < request.getMessages.count) {
                            request.getMessages.count = messagesToFetchLeft;
                        }
                        continue;
                    }
                }
                else if ((0, typescriptAddons_1.hasOwnProperty)(request, "getLatestMessages")) {
                    request.getLatestMessages.upToTimeNanos = [lastAnalyzedMessageTimeNanos];
                    messagesResult.lastAnalyzedMessageTimeNanos = [lastAnalyzedMessageTimeNanos];
                    if (messagesResult.data.length < targetMaxCount) {
                        let messagesToFetchLeft = targetMaxCount - messagesResult.data.length;
                        if (messagesToFetchLeft < request.getLatestMessages.count) {
                            request.getLatestMessages.count = messagesToFetchLeft;
                        }
                        continue;
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
    };
};
//# sourceMappingURL=LogMessagesDataProvider.js.map