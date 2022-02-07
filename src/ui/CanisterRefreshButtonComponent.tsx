import * as React from "react";
import {Button} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import _ from "lodash";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {useCustomCompareCallback} from "use-custom-compare";

type Props = {
    canisterId: string
}

export const CanisterRefreshButtonComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const dataContext = useDataContext();
    const configurationContext = useConfigurationContext();

    const metricsSource = configurationContext.configuration.canisters.find(v => v.canisterId == canisterId)?.metricsSource
    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    });

    const onClick = useCustomCompareCallback(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getCanisterPageParams(canisterId, metricsSource))
    }, [dataContext.getCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    return <Button icon={<ReloadOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}/>
}