import * as React from "react";
import {MetricsData} from "../dataProvider/PrecalculatedPredictionDataProvider";
import {Alert, Space} from "antd";
import {AbstractHelpPopover} from "./AbstractHelpPopover";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {DateTimeUtils} from "./DateTimeUtils";

type Props<V> = {
    data: MetricsData<V>
    differenceTitlePostfix: string
    emptyDataLabel: string | React.ReactNode
    iconColor?: string
}

export function SummaryHelpPopoverWithEmptyData<V>(props: Props<V>) {
    return <AbstractHelpPopover title={"Prediction based on 2 data points"} content={<>
        <Space direction={"vertical"}>
            <div>
                <div>From: {DateTimeUtils.formatDate(props.data.date.fromMillis, "dayTime")}</div>
                <div>To: {DateTimeUtils.formatDate(props.data.date.toMillis, "dayTime")}</div>
            </div>
            <div>
                Difference: {CalculationUtils.formatNumericValue(props.data.data.difference)}{props.differenceTitlePostfix}
            </div>
            <div>
                Prediction: n/a
            </div>
            <Alert type={"warning"} message={props.emptyDataLabel} showIcon/>
        </Space>
    </>} iconColor={props.iconColor}/>
}