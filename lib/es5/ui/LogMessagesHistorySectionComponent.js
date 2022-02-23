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
exports.LogMessagesHistorySectionComponent = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const LogMessagesRealtimeSectionComponent_1 = require("./LogMessagesRealtimeSectionComponent");
const lodash_1 = __importDefault(require("lodash"));
const PageContent_1 = require("./PageContent");
const antd_1 = require("antd");
const ShowButton_1 = require("./ShowButton");
const LogMessagesList_1 = require("./LogMessagesList");
const moment_1 = __importDefault(require("moment"));
const use_custom_compare_1 = require("use-custom-compare");
const react_dom_1 = require("react-dom");
const LogMessagesDataProvider_1 = require("../dataProvider/LogMessagesDataProvider");
const DateTimeUtils_1 = require("./DateTimeUtils");
const LogMessagesCanistersMultiSelect_1 = require("./LogMessagesCanistersMultiSelect");
const URLPathProvider_1 = require("./URLPathProvider");
const LogMessagesHistorySectionComponent = (props) => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const logMessagesDataContext = (0, LogMessagesDataProvider_1.useLogMessagesDataContext)();
    const logTimeRangeFromAllCanisters = (0, use_custom_compare_1.useCustomCompareMemo)(() => {
        return getLogTimeRangeFromAllCanisters(logMessagesDataContext.infoData);
    }, [logMessagesDataContext.infoData], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const canisterIds = configurationContext.configuration.canisters.map(v => v.canisterId);
    const [chunkSize, setChunkSize] = (0, react_1.useState)(LogMessagesRealtimeSectionComponent_1.CHUNK_SIZE_FROM_EACH_CANISTER);
    const [fetchSequence, setFetchSequence] = (0, react_1.useState)(0);
    const [lastAnalyzedMessageTimeNanos, setLastAnalyzedMessageTimeNanos] = (0, react_1.useState)(undefined);
    const [noMoreLogMessages, setNoMoreLogMessages] = (0, react_1.useState)(false);
    const [calendarTimeMillis, setCalendarTimeMillis] = (0, react_1.useState)(undefined);
    const [lineFilterString, setLineFilterString] = (0, react_1.useState)("");
    const [lineFormatString, setLineFormatString] = (0, react_1.useState)(LogMessagesRealtimeSectionComponent_1.DEFAULT_LINE_FORMAT_STRING);
    const [dateFormatString, setDateFormatString] = (0, react_1.useState)(LogMessagesRealtimeSectionComponent_1.DEFAULT_DATE_FORMAT_STRING);
    const [canisterFilter, setCanisterFilter] = (0, react_1.useState)([]);
    const [status, updateStatus] = (0, react_1.useReducer)((state, newState) => ({ ...state, ...newState }), { inProgress: false, loaded: false });
    const [listItems, setListItems] = (0, react_1.useState)([]);
    const [errorsByCanister, updateErrorsByCanister] = (0, react_1.useReducer)((state, newState) => {
        const result = { ...state };
        lodash_1.default.each(newState, (value, key) => {
            result[key] = {
                ...result[key],
                ...value
            };
        });
        return result;
    }, {});
    const buildCanisterLogMessagesParams = (0, use_custom_compare_1.useCustomCompareCallback)(() => {
        const arrayOfCanisterIds = lodash_1.default.isEmpty(canisterFilter) ? canisterIds : canisterFilter;
        return {
            getLogMessagesParameters: {
                canisters: arrayOfCanisterIds.map((canisterId) => {
                    let _fromTimeNanos = [];
                    let _filter = [];
                    if (!lodash_1.default.isEmpty(lineFilterString)) {
                        _filter = [{
                                messageContains: [lineFilterString],
                                messageRegex: [],
                                analyzeCount: chunkSize
                            }];
                    }
                    if (!lodash_1.default.isNil(lastAnalyzedMessageTimeNanos)) {
                        _fromTimeNanos = [lastAnalyzedMessageTimeNanos];
                    }
                    const parameters = {
                        count: chunkSize,
                        filter: _filter,
                        fromTimeNanos: _fromTimeNanos
                    };
                    return {
                        canisterId: canisterId,
                        requestType: "messages",
                        parameters: parameters,
                    };
                }),
                sortItemsBy: (item) => item.logMessagesData.timeNanos
            },
            replaceListItems: false
        };
    }, [lineFilterString, canisterIds, canisterFilter, lastAnalyzedMessageTimeNanos, chunkSize], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const fetchLogMessages = (0, use_custom_compare_1.useCustomCompareCallback)(async (parameters) => {
        updateStatus({ inProgress: true });
        try {
            await logMessagesDataContext.getInfos(parameters.getLogMessagesParameters.canisters.map(v => v.canisterId));
            const result = await logMessagesDataContext.getLogMessages(parameters.getLogMessagesParameters);
            const newListItems = parameters.replaceListItems ? result.listItems : [
                ...listItems,
                ...result.listItems
            ];
            (0, react_dom_1.unstable_batchedUpdates)(() => {
                updateStatus({ inProgress: false, loaded: true });
                updateErrorsByCanister(result.errorsByCanister);
                setFetchSequence(fetchSequence + 1);
                setListItems(newListItems);
                setLastAnalyzedMessageTimeNanos(result.lastAnalyzedMessageTimeNanos);
                setNoMoreLogMessages(lodash_1.default.isNil(result.lastAnalyzedMessageTimeNanos));
            });
        }
        catch (e) {
            console.error(`fetchLogMessages failed: caught error`, e);
            (0, react_dom_1.unstable_batchedUpdates)(() => {
                setListItems([]);
                updateStatus({ inProgress: false, loaded: true });
                updateErrorsByCanister(lodash_1.default.mapValues(lodash_1.default.mapKeys(parameters.getLogMessagesParameters.canisters, v => v.canisterId), () => ({ isError: true, error: e })));
            });
        }
    }, [props.identity, props.host, listItems, fetchSequence, chunkSize], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const onClickShow = (0, react_1.useCallback)(() => {
        const params = buildCanisterLogMessagesParams();
        lodash_1.default.each(params.getLogMessagesParameters.canisters, param => {
            param.parameters.fromTimeNanos = [BigInt(calendarTimeMillis * 1000000)];
        });
        params.replaceListItems = true;
        fetchLogMessages(params);
    }, [buildCanisterLogMessagesParams, fetchLogMessages, calendarTimeMillis]);
    const onClickLoadMore = (0, react_1.useCallback)(() => {
        const params = buildCanisterLogMessagesParams();
        fetchLogMessages(params);
    }, [buildCanisterLogMessagesParams, fetchLogMessages]);
    const lineFormatFn = (0, react_1.useCallback)((item) => {
        return (0, LogMessagesRealtimeSectionComponent_1.formatLine)(item, lineFormatString, dateFormatString);
    }, [lineFormatString, dateFormatString]);
    const onChangeLineFilter = (0, react_1.useCallback)((event) => {
        setLineFilterString(event.target.value);
    }, []);
    const onChangeDatePicker = (0, react_1.useCallback)((value) => {
        const millis = value === null || value === void 0 ? void 0 : value.valueOf();
        setCalendarTimeMillis(millis);
    }, []);
    const disabledDateDatePicker = (0, use_custom_compare_1.useCustomCompareCallback)((date) => {
        return DateTimeUtils_1.DateTimeUtils.isDisabledDateForDatePicker(date === null || date === void 0 ? void 0 : date.valueOf(), {
            minMillis: logTimeRangeFromAllCanisters === null || logTimeRangeFromAllCanisters === void 0 ? void 0 : logTimeRangeFromAllCanisters.fromMillis,
            maxMillis: logTimeRangeFromAllCanisters === null || logTimeRangeFromAllCanisters === void 0 ? void 0 : logTimeRangeFromAllCanisters.toMillis
        });
    }, [logTimeRangeFromAllCanisters], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const disabledTimeDatePicker = (0, use_custom_compare_1.useCustomCompareCallback)((date) => {
        return DateTimeUtils_1.DateTimeUtils.getDisabledTimesForDatePicker(date === null || date === void 0 ? void 0 : date.valueOf(), {
            minMillis: logTimeRangeFromAllCanisters === null || logTimeRangeFromAllCanisters === void 0 ? void 0 : logTimeRangeFromAllCanisters.fromMillis,
            maxMillis: logTimeRangeFromAllCanisters === null || logTimeRangeFromAllCanisters === void 0 ? void 0 : logTimeRangeFromAllCanisters.toMillis
        });
    }, [logTimeRangeFromAllCanisters], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const infoDataNotEmpty = lodash_1.default.some(logMessagesDataContext.infoData, value => !lodash_1.default.isNil(value));
    if (!infoDataNotEmpty) {
        return React.createElement(antd_1.Result, { status: "warning", title: `No data.`, subTitle: React.createElement(React.Fragment, null,
                "Please double check you\u2019ve integrated latest ",
                React.createElement("a", { href: urlPathContext.githubMotokoLibraryURL, target: "_blank" }, "Motoko"),
                " or ",
                React.createElement("a", { href: urlPathContext.githubRustLibraryURL, target: "_blank" }, "Rust"),
                " library into your canisters") });
    }
    const datePickerValue = lodash_1.default.isNumber(calendarTimeMillis) ? (0, moment_1.default)(calendarTimeMillis) : undefined;
    const showButtonDisabled = status.inProgress || lodash_1.default.isNil(calendarTimeMillis);
    return React.createElement("div", { className: "logMessagesSection" },
        React.createElement(PageContent_1.PageContent.Card, null,
            React.createElement(antd_1.Form, { layout: "vertical", className: "canistergeekForm" },
                React.createElement(antd_1.Row, { gutter: 12 },
                    React.createElement(antd_1.Col, null,
                        React.createElement(antd_1.Form.Item, { label: "From" },
                            React.createElement(antd_1.DatePicker, { showTime: true, onChange: onChangeDatePicker, value: datePickerValue, format: LogMessagesRealtimeSectionComponent_1.DEFAULT_DATE_FORMAT_STRING, allowClear: true, placeholder: "Start from time...", disabledDate: disabledDateDatePicker, disabledTime: disabledTimeDatePicker })))),
                React.createElement(PageContent_1.PageContent.CardSection, null),
                React.createElement(antd_1.Row, { gutter: 12 },
                    React.createElement(antd_1.Col, { span: 4 },
                        React.createElement(antd_1.Form.Item, { label: "Message Filter (slow, case sensitive)" },
                            React.createElement(antd_1.Input, { onChange: onChangeLineFilter, value: lineFilterString, allowClear: true, maxLength: LogMessagesRealtimeSectionComponent_1.LINE_FILTER_MAX_LENGTH }))),
                    React.createElement(antd_1.Col, { span: 12 },
                        React.createElement(LogMessagesCanistersMultiSelect_1.LogMessagesCanistersMultiSelect, { canisterFilter: canisterFilter, setCanisterFilter: setCanisterFilter }))),
                React.createElement(antd_1.Row, { className: "drawButtonRow" },
                    React.createElement(antd_1.Col, { span: 24 },
                        React.createElement(ShowButton_1.ShowButton, { onClick: onClickShow, disabled: showButtonDisabled, loading: status.inProgress }))))),
        status.loaded ? React.createElement(React.Fragment, null,
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(PageContent_1.PageContent.Card, null,
                React.createElement(LogMessagesList_1.LogMessagesList, { inProgress: status.inProgress, listItems: listItems, lineFormat: lineFormatFn, sequence: fetchSequence, loadMoreDisabled: noMoreLogMessages, onClickLoadMore: onClickLoadMore }))) : null);
};
exports.LogMessagesHistorySectionComponent = LogMessagesHistorySectionComponent;
const getLogTimeRangeFromAllCanisters = (infoData) => {
    if (lodash_1.default.isEmpty(infoData)) {
        return undefined;
    }
    const fromMillis = Math.floor(Number(lodash_1.default.min(lodash_1.default.compact(lodash_1.default.map(infoData, v => v === null || v === void 0 ? void 0 : v.firstTimeNanos)))) / 1000000);
    const toMillis = Math.floor(Number(lodash_1.default.max(lodash_1.default.compact(lodash_1.default.map(infoData, v => v === null || v === void 0 ? void 0 : v.lastTimeNanos)))) / 1000000);
    return {
        fromMillis: fromMillis,
        toMillis: toMillis,
    };
};
//# sourceMappingURL=LogMessagesHistorySectionComponent.js.map