import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {LineChartOutlined} from "@ant-design/icons";
import _ from "lodash";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";

type Props = {
    canisterId: string
}

export const CanisterForceCollectMetricsButtonComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const dataContext = useDataContext();

    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    });

    const onClick = useCallback(() => {
        (async () => {
            await dataContext.collectCanisterMetrics({canisterIds: [canisterId]})
            dataContext.getCanisterMetrics([
                DashboardUtils.getCanisterMetricsHourlyDashboardParams(canisterId),
                DashboardUtils.getCanisterMetricsDailyDashboardParams(canisterId)
            ])
        })()
    }, [dataContext.getCanisterMetrics, dataContext.collectCanisterMetrics, canisterId])

    return <Button icon={<LineChartOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}>Force Collect Metrics</Button>
}