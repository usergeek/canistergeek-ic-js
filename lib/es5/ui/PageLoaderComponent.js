"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLoaderComponent = void 0;
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const PageLoaderComponent = (props) => {
    let { size } = props;
    if (!size) {
        size = "default";
    }
    return react_1.default.createElement("div", { style: { width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: props.marginTop } },
        react_1.default.createElement(antd_1.Spin, { size: size }),
        props.children);
};
exports.PageLoaderComponent = PageLoaderComponent;
//# sourceMappingURL=PageLoaderComponent.js.map