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
exports.AbstractHelpPopover = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const AbstractHelpPopover = (props) => {
    return React.createElement(antd_1.Popover, { title: props.title, placement: props.placement || "rightTop", content: props.content, trigger: ["click"] },
        React.createElement(antd_1.Button, { shape: "circle", icon: React.createElement(icons_1.QuestionCircleOutlined, { style: { color: props.iconColor } }), type: "text" }));
};
exports.AbstractHelpPopover = AbstractHelpPopover;
//# sourceMappingURL=AbstractHelpPopover.js.map