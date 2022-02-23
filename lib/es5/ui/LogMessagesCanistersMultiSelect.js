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
exports.LogMessagesCanistersMultiSelect = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const SelectTagRenderer_1 = require("./SelectTagRenderer");
const lodash_1 = __importDefault(require("lodash"));
const LogMessagesDataProvider_1 = require("../dataProvider/LogMessagesDataProvider");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const use_custom_compare_1 = require("use-custom-compare");
const LogMessagesCanistersMultiSelect = (props) => {
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const logMessagesDataContext = (0, LogMessagesDataProvider_1.useLogMessagesDataContext)();
    const canisterIds = configurationContext.configuration.canisters.map(v => v.canisterId);
    const atLeastOneCanisterInfoInProgress = lodash_1.default.some(logMessagesDataContext.infoStatus, value => value.inProgress);
    const onChangeCanisters = (0, react_1.useCallback)((value) => {
        props.setCanisterFilter(value);
    }, [props.setCanisterFilter]);
    const canisterSelectOptions = (0, use_custom_compare_1.useCustomCompareMemo)(() => {
        return lodash_1.default.compact(configurationContext.configuration.canisters.map(v => {
            if (lodash_1.default.isNil(logMessagesDataContext.infoData[v.canisterId])) {
                return undefined;
            }
            return {
                label: `${v.name} | ${v.canisterId}`,
                value: v.canisterId,
            };
        }));
    }, [logMessagesDataContext.infoData], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const onFocusCanisters = (0, react_1.useCallback)(() => {
        if (lodash_1.default.isEmpty(canisterSelectOptions)) {
            logMessagesDataContext.getInfos(canisterIds);
        }
    }, [canisterSelectOptions, canisterIds, logMessagesDataContext.getInfos]);
    return React.createElement(antd_1.Form.Item, { label: "Canisters" },
        React.createElement(antd_1.Select, { bordered: true, mode: "multiple", value: props.canisterFilter, optionLabelProp: "label", optionFilterProp: "label", placeholder: "Names or principals...", notFoundContent: React.createElement(React.Fragment, null, "No canisters with log messages..."), showSearch: true, onChange: onChangeCanisters, onFocus: onFocusCanisters, options: canisterSelectOptions, tokenSeparators: [',', ';'], tagRender: SelectTagRenderer_1.SelectTagRenderer, loading: atLeastOneCanisterInfoInProgress, maxTagCount: 2 }));
};
exports.LogMessagesCanistersMultiSelect = LogMessagesCanistersMultiSelect;
//# sourceMappingURL=LogMessagesCanistersMultiSelect.js.map