import * as React from "react";
import {useEffect} from "react";
import {PageHeader} from "antd";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {SummaryTrendSectionTable} from "./SummaryTrendSectionTable";
import {SummaryPredictionSectionTable} from "./SummaryPredictionSectionTable";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {CanisterMetricsErrorPageAlert} from "./CanisterMetricsErrorPageAlert";
import {SummaryRealtimeSectionTable} from "./SummaryRealtimeSectionTable";
import {PageLoaderComponent} from "./PageLoaderComponent";
import _ from "lodash";

export const SummarySectionComponent = () => {
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const atLeastOneCanisterLoaded = _.some(dataContext.status, value => value.loaded);

    useEffect(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getSummaryPageParams(configurationContext.configuration.canisters))
    }, [dataContext.collectCanisterMetrics, dataContext.getCanisterMetrics])

    if (!atLeastOneCanisterLoaded) {
        return <>
            <CanisterMetricsErrorPageAlert error={dataContext.error}/>
            <PageLoaderComponent marginTop={"60px"}/>
        </>
    }
    return <>
        <CanisterMetricsErrorPageAlert error={dataContext.error}/>
        <div className={"summarySection"}>
            <PageHeader title={"Realtime"}>
                <SummaryRealtimeSectionTable/>
            </PageHeader>
            <PageHeader title={"Trends"}>
                <SummaryTrendSectionTable/>
            </PageHeader>
            <PageHeader title={"Prediction"}>
                <SummaryPredictionSectionTable/>
            </PageHeader>
        </div>
    </>
}