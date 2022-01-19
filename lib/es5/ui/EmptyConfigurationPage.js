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
                React.createElement(antd_1.Result, { status: "warning", title: `Configuration is empty.`, extra: React.createElement(antd_1.Button, { type: "primary", key: "console", onClick: onClick }, "Set Up") }))));
};
exports.EmptyConfigurationPage = EmptyConfigurationPage;
//# sourceMappingURL=EmptyConfigurationPage.js.map