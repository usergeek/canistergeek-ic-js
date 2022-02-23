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
exports.LogMessagesSummarySectionComponent = void 0;
const React = __importStar(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const PageContent_1 = require("./PageContent");
const LogMessagesDataProvider_1 = require("../dataProvider/LogMessagesDataProvider");
const antd_1 = require("antd");
const DateUtils_1 = require("../dataProvider/DateUtils");
const Constants_1 = require("../dataProvider/Constants");
const DateTimeUtils_1 = require("./DateTimeUtils");
const moment_1 = __importDefault(require("moment"));
const LogMessagesRealtimeSectionComponent_1 = require("./LogMessagesRealtimeSectionComponent");
const URLPathProvider_1 = require("./URLPathProvider");
const LogMessagesSummarySectionComponent = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const logMessagesDataContext = (0, LogMessagesDataProvider_1.useLogMessagesDataContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const infoDataNotEmpty = lodash_1.default.some(logMessagesDataContext.infoData, value => !lodash_1.default.isNil(value));
    if (!infoDataNotEmpty) {
        return React.createElement(antd_1.Result, { status: "warning", title: `No data.`, subTitle: React.createElement(React.Fragment, null,
                "Please double check you\u2019ve integrated latest ",
                React.createElement("a", { href: urlPathContext.githubMotokoLibraryURL, target: "_blank" }, "Motoko"),
                " or ",
                React.createElement("a", { href: urlPathContext.githubRustLibraryURL, target: "_blank" }, "Rust"),
                " library into your canisters") });
    }
    const inProgress = lodash_1.default.some(logMessagesDataContext.infoStatus, value => value.inProgress);
    const precalculatedDataArray = lodash_1.default.compact(lodash_1.default.map(configurationContext.configuration.canisters, (canister) => {
        const data = logMessagesDataContext.infoData[canister.canisterId];
        if (data) {
            return { canister: canister, data: data };
        }
    }));
    return React.createElement("div", null,
        React.createElement(PageContent_1.PageContent.Card, null,
            React.createElement(antd_1.Table, { dataSource: precalculatedDataArray, pagination: { hideOnSinglePage: true, defaultPageSize: 20 }, size: "small", rowKey: record => record.canister.canisterId, loading: inProgress },
                React.createElement(antd_1.Table.Column, { title: "Canister", width: "16%", key: "Canister", render: (text, record) => {
                        const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId;
                        return canisterName;
                    } }),
                React.createElement(antd_1.Table.Column, { title: "Messages", key: "Messages", width: "28%", render: (text, record) => {
                        return record.data.count;
                    } }),
                React.createElement(antd_1.Table.Column, { title: "First Message Time", key: "First Message Time", width: "28%", render: (text, record) => {
                        return React.createElement(TimeValueComponent, { value: record.data.firstTimeNanos });
                    } }),
                React.createElement(antd_1.Table.Column, { title: "Last Message Time", key: "Last Message Time", width: "28%", render: (text, record) => {
                        return React.createElement(TimeValueComponent, { value: record.data.lastTimeNanos });
                    } }))));
};
exports.LogMessagesSummarySectionComponent = LogMessagesSummarySectionComponent;
const TimeValueComponent = (props) => {
    if (!lodash_1.default.isNil(props.value)) {
        let outdatedContent = null;
        const millis = DateTimeUtils_1.DateTimeUtils.fromNanosToMillis(props.value);
        const currentMillis = new Date().getTime();
        if (currentMillis > millis) {
            const differencesBetweenToMillis = DateUtils_1.DateUtils.Diff.getDifferenceBetweenToMillis(millis, currentMillis);
            const diffString = DateUtils_1.DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis);
            outdatedContent = React.createElement("span", { style: { fontSize: "0.8em", color: "darkgray" } },
                "(",
                diffString,
                " ago)");
        }
        const label = (0, moment_1.default)(millis).format(LogMessagesRealtimeSectionComponent_1.DEFAULT_DATE_FORMAT_STRING);
        return React.createElement("span", null,
            label,
            " ",
            outdatedContent);
    }
    return React.createElement("span", { style: { color: Constants_1.COLOR_GRAY_HEX } }, Constants_1.NO_OBJECT_VALUE_LABEL);
};
//# sourceMappingURL=LogMessagesSummarySectionComponent.js.map