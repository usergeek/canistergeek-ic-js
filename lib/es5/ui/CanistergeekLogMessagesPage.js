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
exports.stringInject = exports.CanistergeekLogMessagesPage = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const URLPathProvider_1 = require("./URLPathProvider");
const react_router_dom_1 = require("react-router-dom");
const Constants_1 = require("../dataProvider/Constants");
const PageContent_1 = require("./PageContent");
const LogMessagesRealtimeSectionComponent_1 = require("./LogMessagesRealtimeSectionComponent");
const LogMessagesHistorySectionComponent_1 = require("./LogMessagesHistorySectionComponent");
const LogMessagesSummarySectionComponent_1 = require("./LogMessagesSummarySectionComponent");
const LogMessagesDataProvider_1 = require("../dataProvider/LogMessagesDataProvider");
const PageLoaderComponent_1 = require("./PageLoaderComponent");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const lodash_1 = __importDefault(require("lodash"));
const LogMessagesSummaryRefreshComponent_1 = require("./LogMessagesSummaryRefreshComponent");
const getContentComponent = (section) => {
    switch (section) {
        case "summary":
            return [React.createElement(LogMessagesSummarySectionComponent_1.LogMessagesSummarySectionComponent, null), React.createElement(antd_1.Space, { direction: "horizontal" },
                    React.createElement(LogMessagesSummaryRefreshComponent_1.LogMessagesSummaryRefreshComponent, null))];
        case "realtime":
            return [React.createElement(LogMessagesRealtimeSectionComponent_1.LogMessagesRealtimeSectionComponent, null), null];
        default:
            return [React.createElement(LogMessagesHistorySectionComponent_1.LogMessagesHistorySectionComponent, null), null];
    }
};
const CanistergeekLogMessagesPage = () => {
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const logMessagesDataContext = (0, LogMessagesDataProvider_1.useLogMessagesDataContext)();
    const history = (0, react_router_dom_1.useHistory)();
    const routeMatch = (0, react_router_dom_1.useRouteMatch)(urlPathContext.logMessagesPath);
    const sectionInURL = routeMatch === null || routeMatch === void 0 ? void 0 : routeMatch.params.section;
    const atLeastOneCanisterInfoLoaded = lodash_1.default.some(logMessagesDataContext.infoStatus, value => value.loaded);
    const onClickMenu = (0, react_1.useCallback)(({ key }) => {
        history.push(urlPathContext.pathToLogMessagesSection(key));
    }, []);
    const canisterIds = configurationContext.configuration.canisters.map(v => v.canisterId);
    (0, react_1.useEffect)(() => {
        logMessagesDataContext.getInfos(canisterIds);
    }, [logMessagesDataContext.getInfos]);
    if (!lodash_1.default.includes(["summary", "realtime", "history"], sectionInURL)) {
        return React.createElement(react_router_dom_1.Redirect, { to: urlPathContext.pathToLogMessagesSection("summary") });
    }
    const [contentComponent, extraComponent] = !atLeastOneCanisterInfoLoaded ?
        [React.createElement(PageLoaderComponent_1.PageLoaderComponent, { marginTop: "60px" }), null]
        :
            getContentComponent(sectionInURL);
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.PageHeader, { title: `${Constants_1.PRODUCT_NAME}: Log Messages`, extra: extraComponent }),
        React.createElement(PageContent_1.PageContent, null,
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(antd_1.Row, null,
                React.createElement(antd_1.Col, { flex: "auto" },
                    React.createElement(antd_1.Menu, { onClick: onClickMenu, selectedKeys: [sectionInURL], mode: "horizontal" },
                        React.createElement(antd_1.Menu.Item, { key: "summary" }, "Summary"),
                        React.createElement(antd_1.Menu.Item, { key: "realtime" }, "Realtime"),
                        React.createElement(antd_1.Menu.Item, { key: "history" }, "History")))),
            contentComponent));
};
exports.CanistergeekLogMessagesPage = CanistergeekLogMessagesPage;
const stringInject = (str, data) => {
    if (typeof str === 'string' && (data instanceof Array)) {
        return str.replace(/({\d})/g, function (i) {
            return data[i.replace(/{/, '').replace(/}/, '')];
        });
    }
    else if (typeof str === 'string' && (data instanceof Object)) {
        if (Object.keys(data).length === 0) {
            return str;
        }
        for (let key in data) {
            return str.replace(/({([^}]+)})/g, function (i) {
                let key = i.replace(/{/, '').replace(/}/, '');
                if (!data[key]) {
                    return i;
                }
                return data[key];
            });
        }
    }
    else if (typeof str === 'string' && data instanceof Array === false || typeof str === 'string' && data instanceof Object === false) {
        return str;
    }
    else {
        return undefined;
    }
};
exports.stringInject = stringInject;
//# sourceMappingURL=CanistergeekLogMessagesPage.js.map