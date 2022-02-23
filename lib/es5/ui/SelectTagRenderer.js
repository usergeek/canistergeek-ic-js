"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectTagRenderer = exports.SelectValue_NotSetValueLabel = void 0;
const react_1 = __importDefault(require("react"));
const icons_1 = require("@ant-design/icons");
const lodash_1 = __importDefault(require("lodash"));
exports.SelectValue_NotSetValueLabel = "(none)";
const SelectTag = ({ onClick, closable, children }) => {
    const closableComponent = closable ? react_1.default.createElement("span", { className: "ant-select-selection-item-remove", unselectable: "on", "aria-hidden": "true" },
        react_1.default.createElement(icons_1.CloseOutlined, { onClick: onClick })) : null;
    return react_1.default.createElement("span", { className: "ant-select-selection-item ug-select-tag" },
        react_1.default.createElement("span", { className: "ant-select-selection-item-content" }, children),
        closableComponent);
};
const SelectTagRenderer = (props) => {
    const { label, value, closable, onClose } = props;
    if (lodash_1.default.isNil(value)) {
        return react_1.default.createElement(SelectTag, { onClick: onClose, closable: closable }, exports.SelectValue_NotSetValueLabel);
    }
    return react_1.default.createElement(SelectTag, { onClick: onClose, closable: closable }, label);
};
exports.SelectTagRenderer = SelectTagRenderer;
//# sourceMappingURL=SelectTagRenderer.js.map