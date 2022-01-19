import * as React from "react";
import {Table} from "antd";
import {Link} from "react-router-dom";
import Highcharts, {AxisLabelsFormatterContextObject, Tooltip, TooltipFormatterContextObject} from "highcharts";
import _ from "lodash"
import {useDataContext} from "../dataProvider/DataProvider";
import {HighchartsDateTimeFacade} from "./HighchartsDateTimeFacade";
import {HighchartsWithOptionsComponent} from "./HighchartsWithOptionsComponent";
import {Canister, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {SummaryPageTrendSectionData, TrendSection24HoursInterval, TrendSectionShiftData, usePrecalculatedTrendDataContext} from "../dataProvider/PrecalculatedTrendDataProvider";
import {CommonNoDataLabel} from "./CommonNoDataLabel";
import {useURLPathContext} from "./URLPathProvider";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {INCOMPLETE_MARKER} from "./HighchartsUtils";

type ChartProps = {
    chartTitle: string
    shiftsData: Array<TrendSectionShiftData>
    tooltipValuePostfix?: string
}

const Chart = React.memo((props: ChartProps) => {

    const data: Array<Highcharts.PointOptionsObject> = props.shiftsData.map(value => {
        if (value.value != undefined) {
            return {
                y: Number(value.value),
                custom: {
                    interval: value.interval,
                    hasValue: true
                }
            }
        }
        return {
            y: null,
            custom: {
                interval: value.interval,
                hasValue: false
            },
        }
    })

    _.each(data, value => {
        if (value.y == null) {
            value.y = 0
            value.marker = INCOMPLETE_MARKER
        }
    })

    const seriesLineOptions: Highcharts.SeriesSplineOptions = {
        type: "spline",
        data: data.reverse(),
    }

    const tooltip: Highcharts.TooltipOptions = {
        useHTML: false,
        formatter: function (this: TooltipFormatterContextObject) {
            const point = this.point;

            // @ts-ignore
            const interval: TrendSection24HoursInterval = point.options.custom.interval

            const dateFrom = Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, interval.fromMillis)
            const dateTo = Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, interval.toMillis)

            const symbol = "<span style='color:" + this.color + "'>\u25CF</span>"

            // @ts-ignore
            const hasValue: boolean = point.options.custom.hasValue
            if (hasValue) {
                const value = CalculationUtils.formatNumericValue(point.y!)
                return `<small>${dateFrom} - ${dateTo}</small><br/>${symbol} ${props.chartTitle}: <b>${value}</b>${props.tooltipValuePostfix || ""}`
            } else {
                return `<small>${dateFrom} - ${dateTo}</small><br/>${symbol} ${props.chartTitle}: <span>n/a</span>`
            }
        }
    }

    const options: Highcharts.Options = {
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                // connectNulls: true
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                formatter: function (this: AxisLabelsFormatterContextObject) {
                    const reverseIndex = data.length - 1 - this.pos
                    const shiftBy24HoursAsString = -props.shiftsData[reverseIndex].numberOfShiftsBy24Hours;
                    return `${shiftBy24HoursAsString}`
                }
            },
            lineColor: 'transparent'
        },
        yAxis: {
            title: undefined,
            gridLineColor: 'transparent',
        },
        legend: {
            enabled: false
        },
        tooltip: tooltip,
        chart: {
            height: 130,
        },
        series: [seriesLineOptions]
    }
    return <HighchartsWithOptionsComponent options={options}/>
}, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps)
})

export const SummaryTrendSectionTable = () => {
    const urlPathContext = useURLPathContext();
    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();
    const precalculatedTrendDataContext = usePrecalculatedTrendDataContext();

    const inProgress = _.some(dataContext.status, value => value.inProgress);

    type TableItemType = { canister: Canister, data: SummaryPageTrendSectionData | undefined }
    let precalculatedDataArray: Array<TableItemType> = configurationContext.configuration.canisters.map(canister => {
        return {
            canister: canister,
            data: precalculatedTrendDataContext.precalculatedData[canister.canisterId]
        }
    })

    return <>
        <Table dataSource={precalculatedDataArray} pagination={{hideOnSinglePage: true, defaultPageSize: 20}} size={"small"} rowKey={record => record.canister.canisterId} loading={inProgress}>
            <Table.Column<TableItemType> title={"Canister"} width={"16%"} key="Canister" render={(text, record) => {
                const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId
                return <Link to={urlPathContext.pathToSection(
                    record.canister.canisterId)}><span style={{fontSize: "1em", fontWeight: "bold"}}>{canisterName}</span></Link>
            }}/>
            <Table.Column<TableItemType> title={"Update Calls"} key="Update Calls" width={"28%"} render={(text, record) => {
                if (record.data) {
                    return <Chart shiftsData={record.data.shiftsData.updateCalls} chartTitle={"Update Calls"}/>
                }
                return <CommonNoDataLabel/>
            }}/>
            <Table.Column<TableItemType> title={"Cycles Difference"} key="Cycles" width={"28%"} render={(text, record) => {
                if (record.data) {
                    return <Chart shiftsData={record.data.shiftsData.cycles.difference} chartTitle={"Cycles Difference"}/>
                }
                return <CommonNoDataLabel/>
            }}/>
            <Table.Column<TableItemType> title={"Memory Difference"} key="Memory" width={"28%"} render={(text, record) => {
                if (record.data) {
                    return <Chart shiftsData={record.data.shiftsData.memoryDifference} chartTitle={"Memory Difference"} tooltipValuePostfix={" bytes"}/>
                }
                return <CommonNoDataLabel/>
            }}/>
        </Table>
    </>
}