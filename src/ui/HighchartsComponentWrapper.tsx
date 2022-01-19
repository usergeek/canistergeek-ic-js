import * as React from "react";
import {Alert, Spin} from "antd";
import _ from "lodash"
import {HighchartsOptionsState} from "./HighchartsOptionsProvider";
import {HighchartsWithOptionsComponent} from "./HighchartsWithOptionsComponent";

type Props = {
    highchartsOptionsState: HighchartsOptionsState
    inProgress: boolean
    chartIdentifier?: string
}

export const HighchartsComponentWrapper = ({highchartsOptionsState, inProgress, chartIdentifier}: Props) => {

    let overlay: React.ReactNode = null
    if (inProgress) {
        overlay = <Spin/>
    } else if (highchartsOptionsState.isError) {
        overlay = <Alert type="error" message={<>{`${highchartsOptionsState.error}`}</>} showIcon/>
    } else if (_.isEmpty(highchartsOptionsState.options)) {
        overlay = <Alert type="warning" message={"No Data"} showIcon/>
    }

    const hasOverlay = !_.isEmpty(overlay)
    return <div className={"highchartsChart" + (hasOverlay ? " highchartsChartMasked" : "")}>
        <div className={"highchartsChartChart"}>
            <HighchartsWithOptionsComponent options={highchartsOptionsState.options} chartIdentifier={chartIdentifier}/>
        </div>
        {hasOverlay && <div className="highchartsChartOverlay">{overlay}</div>}
    </div>
}