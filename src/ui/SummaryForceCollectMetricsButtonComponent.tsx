import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {LineChartOutlined} from "@ant-design/icons";
import _ from "lodash"
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";

export const SummaryForceCollectMetricsButtonComponent = () => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    })

    const onClick = useCallback(() => {
        (async () => {
            //get only canisters with metricsSource = "canister"
            const canisterIdsWithCanisterMetricsSource: Array<string> = _.compact(_.map<Canister, string>(configurationContext.configuration.canisters, (canister) => {
                const metricsSource = configurationContext.configuration.canisters.find(v => v.canisterId == canister.canisterId)?.metricsSource
                if (DashboardUtils.isMetricsSourceCanister(metricsSource)) {
                    return canister.canisterId
                }
            }))
            if (canisterIdsWithCanisterMetricsSource.length > 0) {
                await dataContext.collectCanisterMetrics({canisterIds: canisterIdsWithCanisterMetricsSource})
            }
            dataContext.getCanisterMetrics(DashboardUtils.getSummaryPageParams(configurationContext.configuration.canisters))
        })()
    }, [dataContext.collectCanisterMetrics, dataContext.getCanisterMetrics, configurationContext.configuration.canisters])

    return <Button icon={<LineChartOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}>Force Collect Metrics</Button>
}