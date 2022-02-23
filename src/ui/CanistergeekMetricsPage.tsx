import * as React from "react";
import {useCallback} from "react";
import {Menu, PageHeader, Space} from "antd";
import {Redirect, useHistory, useRouteMatch} from "react-router-dom";
import {Principal} from "@dfinity/principal";
import {MetricsSummarySectionComponent} from "./MetricsSummarySectionComponent";
import {MetricsCanisterSectionComponent} from "./MetricsCanisterSectionComponent";
import {CanisterRefreshButtonComponent} from "./CanisterRefreshButtonComponent";
import {SummaryRefreshComponent} from "./SummaryRefreshComponent";
import {PageContent} from "./PageContent";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {SummaryForceCollectMetricsButtonComponent} from "./SummaryForceCollectMetricsButtonComponent";
import {CanisterForceCollectMetricsButtonComponent} from "./CanisterForceCollectMetricsButtonComponent";
import {useURLPathContext} from "./URLPathProvider";
import {PRODUCT_NAME} from "../dataProvider/Constants";

const getContentComponent = (section: string): [React.ReactNode, React.ReactNode] => {
    switch (section) {
        case "summary":
            return [<MetricsSummarySectionComponent/>, <Space direction={"horizontal"}><SummaryForceCollectMetricsButtonComponent/><SummaryRefreshComponent/></Space>]
        default:
            return [<MetricsCanisterSectionComponent canisterId={section}/>, <Space direction={"horizontal"}><CanisterForceCollectMetricsButtonComponent canisterId={section}/><CanisterRefreshButtonComponent canisterId={section}/></Space>]
    }
}

type URLParams = {
    canisterId: string
}

export const CanistergeekMetricsPage = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const history = useHistory();
    const routeMatch = useRouteMatch<URLParams>(urlPathContext.metricsPath);
    const canisterIdInURL = routeMatch?.params.canisterId!;
    let canisterIdInURLValid = true
    if (canisterIdInURL != "summary") {
        try {
            Principal.fromText(canisterIdInURL)
        } catch (e) {
            canisterIdInURLValid = false
        }
    }
    const onClickMenu = useCallback(({key}) => {
        history.push(urlPathContext.pathToMetricsSection(key))
    }, [])

    if (!canisterIdInURLValid) {
        return <Redirect to={urlPathContext.pathToMetricsSection("summary")}/>
    }

    const [contentComponent, refreshComponent] = getContentComponent(canisterIdInURL)
    return <>
        <PageHeader title={`${PRODUCT_NAME}: Metrics`} extra={refreshComponent}/>
        <PageContent>
            <PageContent.CardSpacer/>
            <Menu onClick={onClickMenu} selectedKeys={[canisterIdInURL]} mode="horizontal">
                <Menu.Item key={"summary"}>Summary</Menu.Item>
                {configurationContext.configuration.canisters.map(canister => {
                    const canisterName = canister.name ? canister.name : canister.canisterId
                    return <Menu.Item key={canister.canisterId}>{canisterName}</Menu.Item>
                })}
            </Menu>
            <PageContent.Card>
                {contentComponent}
            </PageContent.Card>
        </PageContent>
    </>
}