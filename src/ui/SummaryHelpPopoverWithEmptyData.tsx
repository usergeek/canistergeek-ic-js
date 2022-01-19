import * as React from "react";
import {MetricsData} from "../dataProvider/PrecalculatedPredictionDataProvider";
import {Alert, Space} from "antd";
import Highcharts from "highcharts";
import {HighchartsDateTimeFacade} from "./HighchartsDateTimeFacade";
import {AbstractHelpPopover} from "./AbstractHelpPopover";
import {CalculationUtils} from "../dataProvider/CalculationUtils";

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
                <div>From: {Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, props.data.date.fromMillis)}</div>
                <div>To: {Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, props.data.date.toMillis)}</div>
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