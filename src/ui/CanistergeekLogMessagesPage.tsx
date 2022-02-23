import * as React from "react";
import {useCallback, useEffect} from "react";
import {Col, Menu, PageHeader, Row, Space} from "antd";
import {LogMessagesSection, useURLPathContext} from "./URLPathProvider";
import {Redirect, useHistory, useRouteMatch} from "react-router-dom";
import {PRODUCT_NAME} from "../dataProvider/Constants";
import {PageContent} from "./PageContent";
import {LogMessagesRealtimeSectionComponent} from "./LogMessagesRealtimeSectionComponent";
import {LogMessagesHistorySectionComponent} from "./LogMessagesHistorySectionComponent";
import {LogMessagesSummarySectionComponent} from "./LogMessagesSummarySectionComponent";
import {useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";
import {PageLoaderComponent} from "./PageLoaderComponent";
import {CanisterId, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import _ from "lodash"
import {LogMessagesSummaryRefreshComponent} from "./LogMessagesSummaryRefreshComponent";

const getContentComponent = (section: LogMessagesSection): [React.ReactNode, React.ReactNode] => {
    switch (section) {
        case "summary":
            return [<LogMessagesSummarySectionComponent/>, <Space direction={"horizontal"}><LogMessagesSummaryRefreshComponent/></Space>]
        case "realtime":
            return [<LogMessagesRealtimeSectionComponent/>, null]
        default:
            return [<LogMessagesHistorySectionComponent/>, null]
    }
}

type URLParams = {
    section: string
}

export const CanistergeekLogMessagesPage = () => {
    const configurationContext = useConfigurationContext();
    const urlPathContext = useURLPathContext();
    const logMessagesDataContext = useLogMessagesDataContext();
    const history = useHistory();
    const routeMatch = useRouteMatch<URLParams>(urlPathContext.logMessagesPath);
    const sectionInURL = routeMatch?.params.section!;

    const atLeastOneCanisterInfoLoaded = _.some(logMessagesDataContext.infoStatus, value => value.loaded);

    const onClickMenu = useCallback(({key}) => {
        history.push(urlPathContext.pathToLogMessagesSection(key as LogMessagesSection))
    }, [])

    const canisterIds: Array<CanisterId> = configurationContext.configuration.canisters.map(v => v.canisterId)

    useEffect(() => {
        logMessagesDataContext.getInfos(canisterIds)
    }, [logMessagesDataContext.getInfos])

    if (!_.includes(["summary" as LogMessagesSection, "realtime" as LogMessagesSection, "history" as LogMessagesSection], sectionInURL)) {
        return <Redirect to={urlPathContext.pathToLogMessagesSection("summary")}/>
    }

    const [contentComponent, extraComponent] = !atLeastOneCanisterInfoLoaded ?
        [<PageLoaderComponent marginTop={"60px"}/>, null]
        :
        getContentComponent(sectionInURL as LogMessagesSection)

    return <>
        <PageHeader title={`${PRODUCT_NAME}: Log Messages`} extra={extraComponent}/>
        <PageContent>
            <PageContent.CardSpacer/>
            <Row>
                <Col flex={"auto"}>
                    <Menu onClick={onClickMenu} selectedKeys={[sectionInURL]} mode="horizontal">
                        <Menu.Item key={"summary" as LogMessagesSection}>Summary</Menu.Item>
                        <Menu.Item key={"realtime" as LogMessagesSection}>Realtime</Menu.Item>
                        <Menu.Item key={"history" as LogMessagesSection}>History</Menu.Item>
                    </Menu>
                </Col>
            </Row>
            {contentComponent}
        </PageContent>
    </>
}

export const stringInject = (str, data): string => {
    if (typeof str === 'string' && (data instanceof Array)) {

        return str.replace(/({\d})/g, function (i) {
            return data[i.replace(/{/, '').replace(/}/, '')];
        });
    } else if (typeof str === 'string' && (data instanceof Object)) {

        if (Object.keys(data).length === 0) {
            return str;
        }

        for (let key in data) {
            return str.replace(/({([^}]+)})/g, function (i) {
                let key = i.replace(/{/, '').replace(/}/, '');
                if (!data[key]) {
                    return i;
                }

                return data[key];
            });
        }
    } else if (typeof str === 'string' && data instanceof Array === false || typeof str === 'string' && data instanceof Object === false) {

        return str;
    } else {
        return undefined;
    }
}