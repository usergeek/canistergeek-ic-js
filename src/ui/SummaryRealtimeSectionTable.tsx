import * as React from "react";
import {Table} from "antd";
import {Link} from "react-router-dom";
import {useDataContext} from "../dataProvider/DataProvider";
import {SummaryRealtimeSimpleMetricWrapperLabelComponent} from "./SummaryRealtimeSimpleMetricWrapperLabelComponent";
import _ from "lodash";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {SummaryPageRealtimeSectionData, usePrecalculatedRealtimeDataContext} from "../dataProvider/PrecalculatedRealtimeDataProvider";
import {SummaryRealtimeLineProgressWithOutdatedInfo} from "./SummaryRealtimeLineProgressWithOutdatedInfo";
import {useURLPathContext} from "./URLPathProvider";

type TableItemType = { canister: Canister, data: SummaryPageRealtimeSectionData }

export const SummaryRealtimeSectionTable = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();
    const precalculatedRealtimeDataContext = usePrecalculatedRealtimeDataContext();
    const inProgress = _.some(dataContext.status, value => {
        return value.inProgress
    });
    const precalculatedDataArray: Array<TableItemType> = _.compact(_.map<Canister, TableItemType>(configurationContext.configuration.canisters, (canister) => {
        const data = precalculatedRealtimeDataContext.precalculatedData[canister.canisterId];
        if (data) {
            return {canister: canister, data: data} as TableItemType
        }
    }))
    return <>
        <Table dataSource={precalculatedDataArray} pagination={{hideOnSinglePage: true, defaultPageSize: 20}} size={"small"} rowKey={record => record.canister.canisterId} loading={inProgress}>
            <Table.Column<TableItemType> title={"Canister"} width={"16%"} key="Canister" render={(text, record) => {
                const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId
                return <Link to={urlPathContext.pathToSection(record.canister.canisterId)}><span style={{fontSize: "1em", fontWeight: "bold"}}>{canisterName}</span></Link>
            }}/>
            <Table.Column<TableItemType> title={"Cycles"} key="Cycles" width={"28%"} render={(text, record) => {
                return <SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={record.data.cycles}/>
            }}/>
            <Table.Column<TableItemType> title={"Memory"} key="Memory2" width={"28%"} render={(text, record) => {
                const value = record.data.memory;
                return <SummaryRealtimeLineProgressWithOutdatedInfo<number> metricWrapper={value}/>
            }}/>
            <Table.Column<TableItemType> title={"Heap Memory"} key="Heap Memory2" width={"28%"} render={(text, record: TableItemType) => {
                if (record.data.metricsSource == "canister") {
                    const value = record.data.heapMemory;
                    return <SummaryRealtimeLineProgressWithOutdatedInfo<number> metricWrapper={value}/>
                }
                return null
            }}/>
        </Table>
    </>
}