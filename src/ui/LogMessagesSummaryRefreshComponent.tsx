import * as React from "react";
import {useCallback} from "react";
import {Button} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import _ from "lodash"
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";

export const LogMessagesSummaryRefreshComponent = () => {
    const configurationContext = useConfigurationContext();
    const logMessagesDataContext = useLogMessagesDataContext()

    const inProgress = _.some(logMessagesDataContext.infoStatus, value => value.inProgress)

    const onClick = useCallback(() => {
        logMessagesDataContext.getInfos(configurationContext.configuration.canisters.map(v => v.canisterId))
    }, [logMessagesDataContext.getInfos])

    return <Button icon={<ReloadOutlined/>} onClick={onClick} disabled={inProgress} loading={inProgress}/>
}