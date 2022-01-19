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
exports.CardSpacer = exports.PageContent = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const lodash_1 = __importDefault(require("lodash"));
const PageContent = (props) => {
    let className = "pageContent";
    if (!lodash_1.default.isEmpty(props.className)) {
        className = className + " " + props.className;
    }
    return React.createElement("div", { className: className },
        React.createElement(antd_1.Divider, { className: "pageContentTopDivider" }),
        props.children);
};
exports.PageContent = PageContent;
const Card = (props) => {
    return React.createElement("div", { className: "pageContentCard" }, props.children);
};
exports.PageContent.Card = Card;
const CardSpacer = (props) => {
    return React.createElement("div", { className: "pageContentCardSpacer" }, props.children);
};
exports.CardSpacer = CardSpacer;
exports.PageContent.CardSpacer = exports.CardSpacer;
const CardSection = (props) => {
    return React.createElement("div", { className: "pageContentCardSection" }, props.children);
};
exports.PageContent.CardSection = CardSection;
//# sourceMappingURL=PageContent.js.map