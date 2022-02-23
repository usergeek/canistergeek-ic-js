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
exports.formatLine = exports.LogMessagesRealtimeSectionComponent = exports.LINE_FILTER_MAX_LENGTH = exports.DEFAULT_DATE_FORMAT_STRING = exports.DEFAULT_LINE_FORMAT_STRING = exports.CHUNK_SIZE_FROM_EACH_CANISTER = void 0;
const antd_1 = require("antd");
const React = __importStar(require("react"));
const react_1 = require("react");
const lodash_1 = __importDefault(require("lodash"));
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const use_custom_compare_1 = require("use-custom-compare");
const react_dom_1 = require("react-dom");
const ShowButton_1 = require("./ShowButton");
const PageContent_1 = require("./PageContent");
const LogMessagesList_1 = require("./LogMessagesList");
const moment_1 = __importDefault(require("moment"));
const CanistergeekLogMessagesPage_1 = require("./CanistergeekLogMessagesPage");
const LogMessagesDataProvider_1 = require("../dataProvider/LogMessagesDataProvider");
const LogMessagesCanistersMultiSelect_1 = require("./LogMessagesCanistersMultiSelect");
const URLPathProvider_1 = require("./URLPathProvider");
require("./form.less");
require("./logMessagesRealtimeSectionComponent.less");
exports.CHUNK_SIZE_FROM_EACH_CANISTER = 500;
const LINE_FORMAT_STRING_TOKEN_DATE = "{0}";
const LINE_FORMAT_STRING_TOKEN_CANISTER_ID = "{1}";
const LINE_FORMAT_STRING_TOKEN_MESSAGE = "{2}";
exports.DEFAULT_LINE_FORMAT_STRING = `${LINE_FORMAT_STRING_TOKEN_DATE} :: ${LINE_FORMAT_STRING_TOKEN_CANISTER_ID} :: ${LINE_FORMAT_STRING_TOKEN_MESSAGE}`;
exports.DEFAULT_DATE_FORMAT_STRING = "MM/DD hh:mm:ss.SSS A";
exports.LINE_FILTER_MAX_LENGTH = 20;
const LogMessagesRealtimeSectionComponent = (props) => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const logMessagesDataContext = (0, LogMessagesDataProvider_1.useLogMessagesDataContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const canisterIds = configurationContext.configuration.canisters.map(v => v.canisterId);
    const [chunkSize, setChunkSize] = (0, react_1.useState)(exports.CHUNK_SIZE_FROM_EACH_CANISTER);
    const [fetchSequence, setFetchSequence] = (0, react_1.useState)(0);
    const [lastAnalyzedMessageTimeNanos, setLastAnalyzedMessageTimeNanos] = (0, react_1.useState)(undefined);
    const [noMoreLogMessages, setNoMoreLogMessages] = (0, react_1.useState)(false);
    const [lineFilterString, setLineFilterString] = (0, react_1.useState)("");
    const [lineFormatString, setLineFormatString] = (0, react_1.useState)(exports.DEFAULT_LINE_FORMAT_STRING);
    const [dateFormatString, setDateFormatString] = (0, react_1.useState)(exports.DEFAULT_DATE_FORMAT_STRING);
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
    const buildCanisterLatestLogMessagesParams = (0, use_custom_compare_1.useCustomCompareCallback)(() => {
        const arrayOfCanisterIds = lodash_1.default.isEmpty(canisterFilter) ? canisterIds : canisterFilter;
        return {
            getLogMessagesParameters: {
                canisters: arrayOfCanisterIds.map((canisterId) => {
                    let _upToTimeNanos = [];
                    let _filter = [];
                    if (!lodash_1.default.isEmpty(lineFilterString)) {
                        _filter = [{
                                messageContains: [lineFilterString],
                                messageRegex: [],
                                analyzeCount: chunkSize
                            }];
                    }
                    if (!lodash_1.default.isNil(lastAnalyzedMessageTimeNanos)) {
                        _upToTimeNanos = [lastAnalyzedMessageTimeNanos];
                    }
                    const parameters = {
                        count: chunkSize,
                        filter: _filter,
                        upToTimeNanos: _upToTimeNanos
                    };
                    return {
                        canisterId: canisterId,
                        requestType: "lastMessages",
                        parameters: parameters,
                    };
                }),
                sortItemsBy: (item) => -item.logMessagesData.timeNanos
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
        const params = buildCanisterLatestLogMessagesParams();
        lodash_1.default.each(params.getLogMessagesParameters.canisters, param => {
            param.parameters.upToTimeNanos = [];
        });
        params.replaceListItems = true;
        fetchLogMessages(params);
    }, [buildCanisterLatestLogMessagesParams, fetchLogMessages]);
    const onClickLoadMore = (0, react_1.useCallback)(() => {
        const params = buildCanisterLatestLogMessagesParams();
        fetchLogMessages(params);
    }, [buildCanisterLatestLogMessagesParams, fetchLogMessages]);
    const lineFormatFn = (0, react_1.useCallback)((item) => {
        return (0, exports.formatLine)(item, lineFormatString, dateFormatString);
    }, [lineFormatString, dateFormatString]);
    const onChangeLineFilter = (0, react_1.useCallback)((event) => {
        setLineFilterString(event.target.value);
    }, []);
    const onChangeLineFormat = (0, react_1.useCallback)((event) => {
        setLineFormatString(event.target.value);
    }, []);
    const onChangeDateFormat = (0, react_1.useCallback)((event) => {
        setDateFormatString(event.target.value);
    }, []);
    const infoDataNotEmpty = lodash_1.default.some(logMessagesDataContext.infoData, value => !lodash_1.default.isNil(value));
    if (!infoDataNotEmpty) {
        return React.createElement(antd_1.Result, { status: "warning", title: `No data.`, subTitle: React.createElement(React.Fragment, null,
                "Please double check you\u2019ve integrated latest ",
                React.createElement("a", { href: urlPathContext.githubMotokoLibraryURL, target: "_blank" }, "Motoko"),
                " or ",
                React.createElement("a", { href: urlPathContext.githubRustLibraryURL, target: "_blank" }, "Rust"),
                " library into your canisters") });
    }
    const showButtonDisabled = status.inProgress;
    return React.createElement("div", { className: "logMessagesSection" },
        React.createElement(PageContent_1.PageContent.Card, null,
            React.createElement(antd_1.Form, { layout: "vertical", className: "canistergeekForm" },
                React.createElement(antd_1.Row, { gutter: 12 },
                    React.createElement(antd_1.Col, { span: 4 },
                        React.createElement(antd_1.Form.Item, { label: "Message Filter (slow, case sensitive)" },
                            React.createElement(antd_1.Input, { onChange: onChangeLineFilter, value: lineFilterString, allowClear: true, maxLength: exports.LINE_FILTER_MAX_LENGTH }))),
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
exports.LogMessagesRealtimeSectionComponent = LogMessagesRealtimeSectionComponent;
const formatLine = (item, lineFormatString, dateFormatString) => {
    let _lineFormatString = lineFormatString;
    if (lodash_1.default.isEmpty(_lineFormatString)) {
        _lineFormatString = exports.DEFAULT_LINE_FORMAT_STRING;
    }
    let _dateFormatString = dateFormatString;
    if (lodash_1.default.isEmpty(_dateFormatString)) {
        _dateFormatString = exports.DEFAULT_DATE_FORMAT_STRING;
    }
    const dateTime = (0, moment_1.default)(Number(item.logMessagesData.timeNanos) / 1000000).format(_dateFormatString);
    const canisterId = item.canisterId;
    const message = item.logMessagesData.message;
    return (0, CanistergeekLogMessagesPage_1.stringInject)(_lineFormatString, [dateTime, canisterId, message]);
};
exports.formatLine = formatLine;
//# sourceMappingURL=LogMessagesRealtimeSectionComponent.js.map