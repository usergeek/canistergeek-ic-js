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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanistergeekPage = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const principal_1 = require("@dfinity/principal");
const SummarySectionComponent_1 = require("./SummarySectionComponent");
const CanisterSectionComponent_1 = require("./CanisterSectionComponent");
const CanisterRefreshButtonComponent_1 = require("./CanisterRefreshButtonComponent");
const SummaryRefreshComponent_1 = require("./SummaryRefreshComponent");
const PageContent_1 = require("./PageContent");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const SummaryForceCollectMetricsButtonComponent_1 = require("./SummaryForceCollectMetricsButtonComponent");
const CanisterForceCollectMetricsButtonComponent_1 = require("./CanisterForceCollectMetricsButtonComponent");
const URLPathProvider_1 = require("./URLPathProvider");
const Constants_1 = require("../dataProvider/Constants");
const getContentComponent = (section) => {
    switch (section) {
        case "summary":
            return [React.createElement(SummarySectionComponent_1.SummarySectionComponent, null), React.createElement(antd_1.Space, { direction: "horizontal" },
                    React.createElement(SummaryForceCollectMetricsButtonComponent_1.SummaryForceCollectMetricsButtonComponent, null),
                    React.createElement(SummaryRefreshComponent_1.SummaryRefreshComponent, null))];
        default:
            return [React.createElement(CanisterSectionComponent_1.CanisterSectionComponent, { canisterId: section }), React.createElement(antd_1.Space, { direction: "horizontal" },
                    React.createElement(CanisterForceCollectMetricsButtonComponent_1.CanisterForceCollectMetricsButtonComponent, { canisterId: section }),
                    React.createElement(CanisterRefreshButtonComponent_1.CanisterRefreshButtonComponent, { canisterId: section }))];
    }
};
const CanistergeekPage = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const history = (0, react_router_dom_1.useHistory)();
    const routeMatch = (0, react_router_dom_1.useRouteMatch)(urlPathContext.basePath);
    const canisterIdInURL = routeMatch === null || routeMatch === void 0 ? void 0 : routeMatch.params.canisterId;
    let canisterIdInURLValid = true;
    if (canisterIdInURL != "summary") {
        try {
            principal_1.Principal.fromText(canisterIdInURL);
        }
        catch (e) {
            canisterIdInURLValid = false;
        }
    }
    const onClickMenu = (0, react_1.useCallback)(({ key }) => {
        history.push(urlPathContext.pathToSection(key));
    }, []);
    if (!canisterIdInURLValid) {
        return React.createElement(react_router_dom_1.Redirect, { to: urlPathContext.pathToSection("summary") });
    }
    const [contentComponent, refreshComponent] = getContentComponent(canisterIdInURL);
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.PageHeader, { title: `${Constants_1.PRODUCT_NAME}: Dashboard`, extra: refreshComponent }),
        React.createElement(PageContent_1.PageContent, { className: "canistergeekPage" },
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(antd_1.Menu, { onClick: onClickMenu, selectedKeys: [canisterIdInURL], mode: "horizontal" },
                React.createElement(antd_1.Menu.Item, { key: "summary" }, "Summary"),
                configurationContext.configuration.canisters.map(canister => {
                    const canisterName = canister.name ? canister.name : canister.canisterId;
                    return React.createElement(antd_1.Menu.Item, { key: canister.canisterId }, canisterName);
                })),
            React.createElement(PageContent_1.PageContent.Card, null, contentComponent)));
};
exports.CanistergeekPage = CanistergeekPage;
//# sourceMappingURL=CanistergeekPage.js.map