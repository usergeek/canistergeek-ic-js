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
exports.CanisterRefreshButtonComponent = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const lodash_1 = __importDefault(require("lodash"));
const DataProvider_1 = require("../dataProvider/DataProvider");
const DashboardUtils_1 = require("./DashboardUtils");
const CanisterRefreshButtonComponent = (props) => {
    const canisterId = props.canisterId;
    const dataContext = (0, DataProvider_1.useDataContext)();
    const inProgress = lodash_1.default.some(dataContext.status, value => {
        return value.inProgress;
    });
    const onClick = (0, react_1.useCallback)(() => {
        dataContext.getCanisterMetrics([
            DashboardUtils_1.DashboardUtils.getCanisterMetricsHourlyDashboardParams(canisterId),
            DashboardUtils_1.DashboardUtils.getCanisterMetricsDailyDashboardParams(canisterId)
        ]);
    }, [dataContext.getCanisterMetrics, dataContext.collectCanisterMetrics, canisterId]);
    return React.createElement(antd_1.Button, { icon: React.createElement(icons_1.ReloadOutlined, null), onClick: onClick, disabled: inProgress, loading: inProgress });
};
exports.CanisterRefreshButtonComponent = CanisterRefreshButtonComponent;
//# sourceMappingURL=CanisterRefreshButtonComponent.js.map