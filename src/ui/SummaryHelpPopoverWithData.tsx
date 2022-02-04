import * as React from "react";
import {MetricsData} from "../dataProvider/PrecalculatedPredictionDataProvider";
import {Space} from "antd";
import {AbstractHelpPopover} from "./AbstractHelpPopover";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {DateTimeUtils} from "./DateTimeUtils";

type Props<V> = {
    data: MetricsData<V>
    differenceTitlePostfix: string
    predictionLabel: string | React.ReactNode
}

export function SummaryHelpPopoverWithData<V>(props: Props<V>) {
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
                Prediction: {props.predictionLabel}
            </div>
        </Space>
    </>}/>
}