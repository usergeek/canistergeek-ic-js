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
exports.ConfigurationTextarea = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const react_ace_1 = __importDefault(require("react-ace"));
require("ace-builds/src-noconflict/mode-json");
require("ace-builds/src-noconflict/theme-github");
const ConfigurationTextarea = (props) => {
    const onChange = (0, react_1.useCallback)((value) => {
        props.onChange && props.onChange(value);
    }, []);
    return React.createElement(react_ace_1.default, { value: props.value, onChange: onChange, height: `${props.height}px`, width: "100%", mode: "json", theme: "github", showPrintMargin: false, editorProps: { $blockScrolling: true }, setOptions: {
            useWorker: false
        } });
};
exports.ConfigurationTextarea = ConfigurationTextarea;
//# sourceMappingURL=ConfigurationTextarea.js.map