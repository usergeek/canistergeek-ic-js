import * as React from "react";
import _ from "lodash"
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip} from 'chart.js';
import 'chartjs-adapter-moment';
import {Line} from 'react-chartjs-2';
import {ChartJSChartContext} from "./ChartJSChartContext";
import {DateTimeUtils} from "./DateTimeUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
);

export const ColorsDictionary = {
    blue: "#7cb5ec",
    black: "#434348",
    lime: "#90ed7d",
    orange: "#f7a35c",
    darkblue: "#8085e9",
    pink: "#f15c80",
    yellow: "#e4d354",
    green: "#2b908f",
    red: "#f45b5b",
    lightblue: "#91e8e1",
}

const Colors = [ColorsDictionary.blue,
    ColorsDictionary.black,
    ColorsDictionary.lime,
    ColorsDictionary.orange,
    ColorsDictionary.darkblue,
    ColorsDictionary.pink,
    ColorsDictionary.yellow,
    ColorsDictionary.green,
    ColorsDictionary.red,
    ColorsDictionary.lightblue
]

export const getColorByIndex = (index: number): string => Colors[index % Colors.length]

ChartJS.overrides.line.animation = false
ChartJS.defaults.responsive = true
ChartJS.defaults.maintainAspectRatio = false
ChartJS.defaults.interaction.intersect = false
ChartJS.defaults.plugins.legend = {
    ...ChartJS.defaults.plugins.legend,
    display: false
}
ChartJS.defaults.plugins.tooltip = {
    ...ChartJS.defaults.plugins.tooltip,
    backgroundColor: "rgba(247,247,247,0.85)",
    titleColor: "#333333",
    borderColor: ctx => getColorByIndex(ctx.tooltipItems[0].datasetIndex),
    borderWidth: 1,
}
ChartJS.defaults.plugins.tooltip.callbacks = {
    ...ChartJS.defaults.plugins.tooltip.callbacks,
    title: tooltipItems => {
        return DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day")
    },
    labelTextColor: (tooltipItem) => '#333333',
    label: tooltipItem => ` ${tooltipItem.parsed.y}`
}

type Props = {
    chartContext: ChartJSChartContext
    chartIdentifier?: string
    cssProps?: React.CSSProperties
}

export const ChartJSWithOptionsComponent = React.memo(({chartContext, cssProps}: Props) => {
    return <>
        <Line options={chartContext.options} data={chartContext.data} style={{width: "100%", height: "432px", ...cssProps}}/>
    </>
}, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps)
})

ChartJSWithOptionsComponent.displayName = "ChartJSWithOptionsComponent"