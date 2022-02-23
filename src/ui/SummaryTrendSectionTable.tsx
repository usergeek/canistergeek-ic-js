import * as React from "react";
import {Table} from "antd";
import {Link} from "react-router-dom";
import _ from "lodash"
import {useDataContext} from "../dataProvider/DataProvider";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {SummaryPageTrendSectionData, TrendSectionShiftData, usePrecalculatedTrendDataContext} from "../dataProvider/PrecalculatedTrendDataProvider";
import {CommonNoDataLabel} from "./CommonNoDataLabel";
import {useURLPathContext} from "./URLPathProvider";
import {ChartJSWithOptionsComponent} from "./ChartJSWithOptionsComponent";
import {ChartJSUtils, ChartOptionsParams as ChartJSChartOptionsParams} from "./ChartJSUtils";
import {ChartJSComponentSupplierContext, ChartJSComponentSupplierProvider} from "./ChartJSComponentSupplierProvider";

type ChartProps = {
    shiftsData: Array<TrendSectionShiftData> | undefined
    tooltipValuePrefix?: string
    tooltipValuePostfix?: string
    yAxisMin?: number
}

const ChartJS = React.memo((props: ChartProps) => {
    return <ChartJSComponentSupplierProvider<Array<TrendSectionShiftData> | undefined, ChartJSChartOptionsParams> data={props.shiftsData}
                                                                                                                  parameters={{
                                                                                                                      tooltipValuePrefix: props.tooltipValuePrefix,
                                                                                                                      tooltipValuePostfix: props.tooltipValuePostfix,
                                                                                                                      yAxisMin: props.yAxisMin,
                                                                                                                  }}
                                                                                                                  chartContextProviderFn={ChartJSUtils.provideCommonOptionsForTrendShiftDataChart}>
        <ChartJSComponentSupplierContext.Consumer>
            {context => {
                if (context.state.chartContext) {
                    return <ChartJSWithOptionsComponent chartContext={context.state.chartContext} cssProps={{height: "130px"}}/>
                }
                return <CommonNoDataLabel/>
            }}
        </ChartJSComponentSupplierContext.Consumer>
    </ChartJSComponentSupplierProvider>
}, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps)
})

type TableItemType = { canister: Canister, data: SummaryPageTrendSectionData | undefined }

export const SummaryTrendSectionTable = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();
    const precalculatedTrendDataContext = usePrecalculatedTrendDataContext();

    const inProgress = _.some(dataContext.status, value => value.inProgress);

    let precalculatedDataArray: Array<TableItemType> = _.compact(_.map<Canister, TableItemType>(configurationContext.configuration.canisters, canister => {
        const data = precalculatedTrendDataContext.precalculatedData[canister.canisterId];
        if (data) {
            return {canister: canister, data: data} as TableItemType
        }
    }))

    return <>
        <Table dataSource={precalculatedDataArray} pagination={{hideOnSinglePage: true, defaultPageSize: 20}} size={"small"} rowKey={record => record.canister.canisterId} loading={inProgress}>
            <Table.Column<TableItemType> title={"Canister"} width={"16%"} key="Canister" render={(text, record) => {
                const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId
                return <Link to={urlPathContext.pathToMetricsSection(record.canister.canisterId)}><span style={{fontSize: "1em", fontWeight: "bold"}}>{canisterName}</span></Link>
            }}/>
            <Table.Column<TableItemType> title={"Update Calls"} key="Update Calls" width={"28%"} render={(text, record) => {
                return <ChartJS shiftsData={record.data.shiftsData.updateCalls} tooltipValuePrefix={"Update Calls"} yAxisMin={0}/>
            }}/>
            <Table.Column<TableItemType> title={"Cycles Difference"} key="Cycles" width={"28%"} render={(text, record) => {
                return <ChartJS shiftsData={record.data.shiftsData.cycles.difference} tooltipValuePrefix={"Cycles Difference"}/>
            }}/>
            <Table.Column<TableItemType> title={"Memory Difference"} key="Memory" width={"28%"} render={(text, record) => {
                return <ChartJS shiftsData={record.data.shiftsData.memoryDifference} tooltipValuePrefix={"Memory Difference"} tooltipValuePostfix={" bytes"}/>
            }}/>
        </Table>
    </>
}