import * as React from "react";
import _ from "lodash"
import {ChartJSWithOptionsComponent} from "./ChartJSWithOptionsComponent";
import {ChartJSChartComponentSupplier} from "./ChartJSChartContext";
import {Alert, Spin} from "antd";

import "./chartJSComponentWrapper.css"

type Props = {
    supplier: ChartJSChartComponentSupplier
    inProgress: boolean
    [key: string]: any
}

export const ChartJSComponentWrapper = ({supplier, inProgress, chartIdentifier}: Props) => {
    let overlay: React.ReactNode = null
    if (inProgress) {
        overlay = <Spin/>
    } else if (supplier.isError) {
        overlay = <Alert type="error" message={<>{`${supplier.error}`}</>} showIcon/>
    } else if (_.isEmpty(supplier.chartContext)) {
        overlay = <Alert type="warning" message={"No Data"} showIcon/>
    }

    const hasOverlay = !_.isEmpty(overlay)
    const content: React.ReactNode = _.isEmpty(supplier.chartContext) ? null : <ChartJSWithOptionsComponent chartContext={supplier.chartContext!} chartIdentifier={chartIdentifier}/>
    return <div className={"chartJSContainer" + (hasOverlay ? " chartJSContainerMasked" : "")}>
        <div className={"chartJSChart"}>
            {content}
        </div>
        {hasOverlay && <div className="chartJSChartOverlay">{overlay}</div>}
    </div>
}