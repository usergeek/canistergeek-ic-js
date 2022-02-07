import * as React from "react";
import {Button} from "antd";
import {LineChartOutlined} from "@ant-design/icons";
import _ from "lodash";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {useCustomCompareCallback} from "use-custom-compare";

type Props = {
    canisterId: string
}

export const CanisterForceCollectMetricsButtonComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const dataContext = useDataContext();
    const configurationContext = useConfigurationContext();

    const metricsSource = configurationContext.configuration.canisters.find(v => v.canisterId == canisterId)?.metricsSource
    const isMetricsSourceCanister = DashboardUtils.isMetricsSourceCanister(metricsSource)

    const onClick = useCustomCompareCallback(() => {
        (async () => {
            if (DashboardUtils.isMetricsSourceCanister(metricsSource)) {
                await dataContext.collectCanisterMetrics({canisterIds: [canisterId]})
            }
            dataContext.getCanisterMetrics(DashboardUtils.getCanisterPageParams(canisterId, metricsSource))
        })()
    }, [dataContext.getCanisterMetrics, dataContext.collectCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    if (isMetricsSourceCanister) {
        const inProgress = _.some(dataContext.status, value => {
            return value.inProgress
        });
        return <Button icon={<LineChartOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}>Force Collect Metrics</Button>
    }
    return null
}