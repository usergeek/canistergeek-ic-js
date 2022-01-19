import * as React from "react";
import {useRef} from "react";
import _ from "lodash"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HC_exporting from 'highcharts/modules/exporting'
import HC_offline_exporting from 'highcharts/modules/offline-exporting'
import {HighchartsThemeFacade, UsergeekHighchartsTheme} from "./HighchartsThemeFacade";

HC_exporting(Highcharts)
HC_offline_exporting(Highcharts)

window.Highcharts = Highcharts
HighchartsThemeFacade.applyTheme(UsergeekHighchartsTheme.default)

type Props = {
    options: object,
    chartIdentifier?: string
}

export const HighchartsWithOptionsComponent = React.memo(({options}: Props) => {
    const highchartsRef = useRef<{
        chart: Highcharts.Chart;
        container: React.RefObject<HTMLDivElement>;
    }>(null);

    return <>
        <HighchartsReact ref={highchartsRef} highcharts={Highcharts} options={options} containerProps={{style: {width: "100%"}}} immutable={true}/>
    </>
}, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps)
})

HighchartsWithOptionsComponent.displayName = "HighchartsWithOptionsComponent"