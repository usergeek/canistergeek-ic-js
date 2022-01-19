import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import _ from "lodash";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";

type Props = {
    canisterId: string
}

export const CanisterRefreshButtonComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const dataContext = useDataContext();

    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    });

    const onClick = useCallback(() => {
        dataContext.getCanisterMetrics([
            DashboardUtils.getCanisterMetricsHourlyDashboardParams(canisterId),
            DashboardUtils.getCanisterMetricsDailyDashboardParams(canisterId)
        ])
    }, [dataContext.getCanisterMetrics, dataContext.collectCanisterMetrics, canisterId])

    return <Button icon={<ReloadOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}/>
}