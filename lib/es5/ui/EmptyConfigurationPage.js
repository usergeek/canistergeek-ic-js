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
exports.EmptyConfigurationPage = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const PageContent_1 = require("./PageContent");
const Constants_1 = require("../dataProvider/Constants");
const EmptyConfigurationPage = (props) => {
    const history = (0, react_router_dom_1.useHistory)();
    const onClick = (0, react_1.useCallback)(() => {
        history.push(props.configURL);
    }, [props.configURL]);
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.PageHeader, { title: `${Constants_1.PRODUCT_NAME}: Setup` }),
        React.createElement(PageContent_1.PageContent, null,
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(PageContent_1.PageContent.Card, null,
                React.createElement(antd_1.Result, { status: "warning", title: `Configuration is empty`, subTitle: React.createElement(antd_1.Row, { justify: "center" },
                        React.createElement(antd_1.Col, null,
                            React.createElement("div", { style: { textAlign: "left", marginTop: "25px" } },
                                React.createElement("ol", { style: { padding: 0, listStylePosition: "outside" } },
                                    React.createElement("li", { style: { paddingLeft: "10px" } },
                                        "Integrate ",
                                        React.createElement("a", { href: props.githubMotokoLibraryURL, target: "_blank" }, "Motoko"),
                                        " or ",
                                        React.createElement("a", { href: props.githubRustLibraryURL, target: "_blank" }, "Rust"),
                                        " library into your canisters"),
                                    React.createElement("li", { style: { paddingLeft: "10px" } },
                                        React.createElement("b", null, "HIGHLY RECOMMENDED"),
                                        ":",
                                        React.createElement("br", null),
                                        "Limit access to your data only to specific principals.",
                                        React.createElement("br", null),
                                        "More information ",
                                        React.createElement("a", { href: props.githubMotokoLibraryLimitAccessURL, target: "_blank" }, "here"),
                                        " or ",
                                        React.createElement("a", { href: props.githubRustLibraryLimitAccessURL, target: "_blank" }, "here")),
                                    React.createElement("li", { style: { paddingLeft: "10px" } }, "Set up configuration: provide list of canister principals"))))), extra: React.createElement(antd_1.Button, { type: "primary", key: "console", onClick: onClick }, "Set Up") }))));
};
exports.EmptyConfigurationPage = EmptyConfigurationPage;
//# sourceMappingURL=EmptyConfigurationPage.js.map