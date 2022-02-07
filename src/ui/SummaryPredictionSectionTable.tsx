import * as React from "react";
import {useDataContext} from "../dataProvider/DataProvider";
import _ from "lodash";
import {Table} from "antd";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {Link} from "react-router-dom";
import {CanisterPredictionData, usePrecalculatedPredictionDataContext} from "../dataProvider/PrecalculatedPredictionDataProvider";
import {SummaryPredictionSectionTableCellComponent} from "./SummaryPredictionSectionTableCellComponent";
import {useURLPathContext} from "./URLPathProvider";

type TableItemType = { canister: Canister, data: CanisterPredictionData | undefined }

export const SummaryPredictionSectionTable = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();
    const precalculatedPredictionDataContext = usePrecalculatedPredictionDataContext();

    const inProgress = _.some(dataContext.status, value => value.inProgress);

    const precalculatedDataArray: Array<TableItemType> = _.compact(_.map<Canister, TableItemType>(configurationContext.configuration.canisters, canister => {
        const data = precalculatedPredictionDataContext.precalculatedData[canister.canisterId];
        if (data) {
            return {canister: canister, data: data} as TableItemType
        }
    }))
    return <>
        <Table<TableItemType> dataSource={precalculatedDataArray} pagination={{hideOnSinglePage: true, defaultPageSize: 20}} size={"small"} rowKey={record => record.canister.canisterId} loading={inProgress}>
            <Table.Column<TableItemType> title={"Canister"} width={"16%"} key={"Canister"} render={(text, record) => {
                const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId
                return <Link to={urlPathContext.pathToSection(
                    record.canister.canisterId)}><span style={{fontSize: "1em", fontWeight: "bold"}}>{canisterName}</span></Link>
            }
            }/>
            <Table.Column<TableItemType> title={"Cycles will run out in"} width={"28%"} key={"Cycles"} render={(text, record) => <SummaryPredictionSectionTableCellComponent<number> data={record.data.predictionData.cycles} metric={"cycles"} differenceTitlePostfix={" cycles"}/>}/>
            <Table.Column<TableItemType> title={"Canister will run out of memory in"} width={"28%"} key={"Memory"} render={(text, record) => <SummaryPredictionSectionTableCellComponent<number> data={record.data.predictionData.memory} metric={"memory"} differenceTitlePostfix={" bytes"}/>}/>
            <Table.Column<TableItemType> title={<>&nbsp;</>} width={"28%"} key={"Heap Memory"} render={() => <>&nbsp;</>}/>
        </Table>
    </>
}