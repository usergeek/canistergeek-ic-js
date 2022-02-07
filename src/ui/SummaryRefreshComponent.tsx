import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import _ from "lodash"
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";

export const SummaryRefreshComponent = () => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    })

    const onClick = useCallback(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getSummaryPageParams(configurationContext.configuration.canisters))
    }, [dataContext.getCanisterMetrics])

    return <Button icon={<ReloadOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}/>
}