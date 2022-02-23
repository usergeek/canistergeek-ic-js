import * as React from "react";
import _ from "lodash";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {PageContent} from "./PageContent";
import {InfoData, useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";
import {Result, Table} from "antd";
import {DateUtils} from "../dataProvider/DateUtils";
import {COLOR_GRAY_HEX, NO_OBJECT_VALUE_LABEL} from "../dataProvider/Constants";
import {DateTimeUtils} from "./DateTimeUtils";
import Moment from "moment";
import {DEFAULT_DATE_FORMAT_STRING} from "./LogMessagesRealtimeSectionComponent";
import {useURLPathContext} from "./URLPathProvider";

type TableItemType = { canister: Canister, data: InfoData }

export const LogMessagesSummarySectionComponent = () => {
    const urlPathContext = useURLPathContext();
    const logMessagesDataContext = useLogMessagesDataContext();
    const configurationContext = useConfigurationContext();

    const infoDataNotEmpty = _.some(logMessagesDataContext.infoData, value => !_.isNil(value));

    if (!infoDataNotEmpty) {
        return <Result status="warning" title={`No data.`} subTitle={<>Please double check you’ve integrated latest <a href={urlPathContext.githubMotokoLibraryURL} target={"_blank"}>Motoko</a> or <a href={urlPathContext.githubRustLibraryURL} target={"_blank"}>Rust</a> library into your canisters</>}/>
    }

    const inProgress = _.some(logMessagesDataContext.infoStatus, value => value.inProgress);

    const precalculatedDataArray: Array<TableItemType> = _.compact(_.map<Canister, TableItemType>(configurationContext.configuration.canisters, (canister) => {
        const data = logMessagesDataContext.infoData[canister.canisterId];
        if (data) {
            return {canister: canister, data: data} as TableItemType
        }
    }))

    return <div>
        <PageContent.Card>
            <Table dataSource={precalculatedDataArray} pagination={{hideOnSinglePage: true, defaultPageSize: 20}} size={"small"} rowKey={record => record.canister.canisterId} loading={inProgress}>
                <Table.Column<TableItemType> title={"Canister"} width={"16%"} key="Canister" render={(text, record) => {
                    const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId
                    return canisterName
                }}/>
                <Table.Column<TableItemType> title={"Messages"} key="Messages" width={"28%"} render={(text, record) => {
                    return record.data.count
                }}/>
                <Table.Column<TableItemType> title={"First Message Time"} key="First Message Time" width={"28%"} render={(text, record) => {
                    return <TimeValueComponent value={record.data.firstTimeNanos}/>
                }}/>
                <Table.Column<TableItemType> title={"Last Message Time"} key="Last Message Time" width={"28%"} render={(text, record) => {
                    return <TimeValueComponent value={record.data.lastTimeNanos}/>
                }}/>
            </Table>
        </PageContent.Card>
    </div>
}

const TimeValueComponent = (props: { value?: bigint }) => {
    if (!_.isNil(props.value)) {
        let outdatedContent: React.ReactNode = null;
        const millis = DateTimeUtils.fromNanosToMillis(props.value);
        const currentMillis = new Date().getTime();
        if (currentMillis > millis) {
            const differencesBetweenToMillis = DateUtils.Diff.getDifferenceBetweenToMillis(millis, currentMillis);
            const diffString = DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis);
            outdatedContent = <span style={{fontSize: "0.8em", color: "darkgray"}}>({diffString} ago)</span>
        }
        const label = Moment(millis).format(DEFAULT_DATE_FORMAT_STRING)
        return <span>{label} {outdatedContent}</span>
    }
    return <span style={{color: COLOR_GRAY_HEX}}>{NO_OBJECT_VALUE_LABEL}</span>
}
