import * as React from "react";
import {MetricsData} from "../dataProvider/PrecalculatedPredictionDataProvider";
import {SummaryHelpPopoverWithEmptyData} from "./SummaryHelpPopoverWithEmptyData";
import {CommonNoDataLabel} from "./CommonNoDataLabel";
import {SummaryHelpPopoverWithData} from "./SummaryHelpPopoverWithData";
import {Col, Progress, Row} from "antd";

type Props<V> = {
    metric: "cycles" | "memory"
    data: MetricsData<V> | undefined
    differenceTitlePostfix: string
}

export function SummaryPredictionSectionTableCellComponent<V>(props: Props<V>) {
    if (props.data) {
        const metricWrapper = props.data.metricWrapper;
        if (metricWrapper) {
            const hasValue = metricWrapper.hasValue
            if (hasValue) {
                return <Row align={"middle"} gutter={8}>
                    <Col flex={"auto"}><Progress type="line" percent={metricWrapper.percentFromMax} strokeColor={metricWrapper.colorHex} showInfo={false}/></Col>
                    <Col>{metricWrapper.label}</Col>
                    <Col><SummaryHelpPopoverWithData data={props.data} predictionLabel={metricWrapper.label} differenceTitlePostfix={props.differenceTitlePostfix}/></Col>
                </Row>
            }
            let emptyDataLabel: React.ReactNode = null
            if (props.metric == "cycles") {
                if (props.data.data.difference == 0) {
                    emptyDataLabel = <>No cycles were burned</>
                } else {
                    emptyDataLabel = <>Looks like cycles topped up</>
                }
            } else if (props.metric == "memory") {
                if (props.data.data.difference == 0) {
                    emptyDataLabel = <>No memory was changed</>
                } else {
                    emptyDataLabel = <>Looks like memory freed up</>
                }
            }
            return <>
                <CommonNoDataLabel/>
                <SummaryHelpPopoverWithEmptyData data={props.data} differenceTitlePostfix={props.differenceTitlePostfix} emptyDataLabel={emptyDataLabel} iconColor={metricWrapper.colorHex}/>
            </>
        }
    }
    return <CommonNoDataLabel/>
}