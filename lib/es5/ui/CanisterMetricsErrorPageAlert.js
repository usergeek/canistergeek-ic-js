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
exports.CanisterMetricsErrorPageAlert = void 0;
const React = __importStar(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const PageContentAlert_1 = require("./PageContentAlert");
const agent_1 = require("@dfinity/agent");
const antd_1 = require("antd");
const paragraphEllipsisConfig = {
    rows: 1,
    expandable: true,
    symbol: 'more'
};
const CanisterMetricsErrorPageAlert = (props) => {
    const hasErrors = lodash_1.default.some(props.error, value => {
        return value.isError;
    });
    if (hasErrors) {
        return React.createElement(PageContentAlert_1.PageContentAlert, { type: "error", message: React.createElement(React.Fragment, null, "Oops, something went wrong"), description: React.createElement(React.Fragment, null,
                "Please try again.",
                React.createElement("ol", null, lodash_1.default.map(props.error, (v, k) => {
                    if (v.isError) {
                        if (v.error instanceof agent_1.QueryCallRejectedError) {
                            const ee = v.error;
                            const canisterId = ee.canisterId.toText();
                            return React.createElement("li", { key: canisterId },
                                canisterId,
                                React.createElement("br", null),
                                React.createElement(antd_1.Typography.Paragraph, { ellipsis: paragraphEllipsisConfig }, ee.message));
                        }
                        else if (v.error instanceof Error) {
                            const ee = v.error;
                            const canisterId = k;
                            return React.createElement("li", { key: canisterId },
                                canisterId,
                                React.createElement("br", null),
                                React.createElement(antd_1.Typography.Paragraph, { ellipsis: paragraphEllipsisConfig }, ee.message));
                        }
                        else {
                            const canisterId = k;
                            return React.createElement("li", { key: canisterId },
                                canisterId,
                                React.createElement("br", null),
                                React.createElement(antd_1.Typography.Paragraph, { ellipsis: paragraphEllipsisConfig }, JSON.stringify(v.error)));
                        }
                    }
                    return null;
                }))) });
    }
    return null;
};
exports.CanisterMetricsErrorPageAlert = CanisterMetricsErrorPageAlert;
//# sourceMappingURL=CanisterMetricsErrorPageAlert.js.map