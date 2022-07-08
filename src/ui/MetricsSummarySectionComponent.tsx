import * as React from "react";
import {useEffect} from "react";
import {PageHeader, Result} from "antd";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {SummaryTrendSectionTable} from "./SummaryTrendSectionTable";
import {SummaryPredictionSectionTable} from "./SummaryPredictionSectionTable";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {SummaryRealtimeSectionTable} from "./SummaryRealtimeSectionTable";
import {PageLoaderComponent} from "./PageLoaderComponent";
import _ from "lodash";
import {useURLPathContext} from "./URLPathProvider";

export const MetricsSummarySectionComponent = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const atLeastOneCanisterLoaded = _.some(dataContext.status, value => value.loaded);

    useEffect(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getSummaryPageParams(configurationContext.configuration.canisters))
    }, [dataContext.getCanisterMetrics])

    if (!atLeastOneCanisterLoaded) {
        return <>
            <PageLoaderComponent marginTop={"60px"}/>
        </>
    }

    const dataHourlyNotEmpty = _.some(dataContext.dataHourly, value => !_.isNil(value));
    const dataDailyNotEmpty = _.some(dataContext.dataDaily, value => !_.isNil(value));
    const dataBlackholeNotEmpty = _.some(dataContext.dataBlackhole, value => !_.isNil(value));

    if (!dataHourlyNotEmpty && !dataDailyNotEmpty && !dataBlackholeNotEmpty) {
        return <Result status="warning" title={`No data.`} subTitle={<>Please double check you’ve integrated latest <a href={urlPathContext.githubMotokoLibraryURL} target={"_blank"}>Motoko</a> or <a href={urlPathContext.githubRustLibraryURL} target={"_blank"}>Rust</a> library into your canisters</>}/>
    }

    return <>
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