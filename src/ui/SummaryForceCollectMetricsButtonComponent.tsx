import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {LineChartOutlined} from "@ant-design/icons";
import _ from "lodash"
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";

export const SummaryForceCollectMetricsButtonComponent = () => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    })

    const onClick = useCallback(() => {
        (async () => {
            await dataContext.collectCanisterMetrics({canisterIds: configurationContext.configuration.canisters.map(v => v.canisterId)})
            dataContext.getCanisterMetrics(configurationContext.configuration.canisters.map(canister => DashboardUtils.getCanisterMetricsHourlyDashboardParams(canister.canisterId)))
        })()
    }, [dataContext.collectCanisterMetrics, dataContext.getCanisterMetrics])

    return <Button icon={<LineChartOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}>Force Collect Metrics</Button>
}