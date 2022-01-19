import * as React from "react";
import {useEffect} from "react";
import {Col, Descriptions, PageHeader, Row, Spin, Typography} from "antd";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {ChartDailyData, ChartHourlyDataSource, ChartOptionsParams, DailyChartWithNumericEntityData, HighchartsUtils} from "./HighchartsUtils";
import {HighchartsOptionsContext, HighchartsOptionsProvider} from "./HighchartsOptionsProvider";
import {HighchartsComponentWrapper} from "./HighchartsComponentWrapper";
import {CanisterMetricsErrorPageAlert} from "./CanisterMetricsErrorPageAlert";
import _ from "lodash"
import {DataProviderUtils} from "../dataProvider/DataProviderUtils";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {SummaryRealtimeSimpleMetricWrapperLabelComponent} from "./SummaryRealtimeSimpleMetricWrapperLabelComponent";
import {PrecalculatedRealtimeDataProviderCalculator} from "../dataProvider/PrecalculatedRealtimeDataProviderCalculator";
import {useConfigurationContext} from "../dataProvider/ConfigurationProvider";

type Props = {
    canisterId: string
}

export const CanisterSectionComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const canisterError = dataContext.error[canisterId]
    const canisterInProgress = dataContext.status[canisterId]?.inProgress

    useEffect(() => {
        dataContext.getCanisterMetrics([
            DashboardUtils.getCanisterMetricsHourlyDashboardParams(canisterId),
            DashboardUtils.getCanisterMetricsDailyDashboardParams(canisterId)
        ])
    }, [dataContext.getCanisterMetrics, dataContext.collectCanisterMetrics, canisterId])

    const dataHourly = dataContext.dataHourly;
    const dataDaily = dataContext.dataDaily;
    const canisterUpdateCallsAggregatedDataHourly: Array<ChartHourlyDataSource> | undefined = DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)?.map<ChartHourlyDataSource>(value => ({timeMillis: value.timeMillis, values: value.updateCalls}));
    const canisterCyclesAggregatedDataHourly: Array<ChartHourlyDataSource> | undefined = DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)?.map<ChartHourlyDataSource>(value => ({timeMillis: value.timeMillis, values: value.canisterCycles}));
    const canisterMemoryAggregatedDataHourly: Array<ChartHourlyDataSource> | undefined = DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)?.map<ChartHourlyDataSource>(value => ({timeMillis: value.timeMillis, values: value.canisterMemorySize}));
    const canisterHeapMemoryAggregatedDataHourly: Array<ChartHourlyDataSource> | undefined = DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)?.map<ChartHourlyDataSource>(value => ({timeMillis: value.timeMillis, values: value.canisterHeapMemorySize}));
    const dataDailyMetrics = DataProviderUtils.getDataDailyMetrics(dataDaily, canisterId);
    const dataHourlyLatestMetrics = DataProviderUtils.getDataHourlyLatestMetrics(dataHourly, canisterId);
    const dataDailyLatestMetrics = DataProviderUtils.getDataDailyLatestMetrics(dataDaily, canisterId);

    const configuration = configurationContext.configuration;
    const configurationMetrics = configuration.metrics;
    const configurationMetricsCycles = configurationMetrics.cycles;
    const configurationMetricsMemory = configurationMetrics.memory;
    const configurationMetricsHeapMemory = configurationMetrics.heapMemory;

    return <>
        <CanisterMetricsErrorPageAlert error={_.pick(dataContext.error, canisterId)}/>
        <PageHeader title={<>Today {canisterInProgress ? <Spin size={"small"} style={{marginLeft: "15px"}}/> : null}</>}>
            <Row>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Update calls</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getUpdateCallsMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics)}/></Descriptions.Item>
                        <Descriptions.Item label="Cumulative">{CalculationUtils.formatSignificantSumArray(dataHourlyLatestMetrics?.updateCalls)}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Cycles</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getCyclesMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration)}/></Descriptions.Item>
                        <Descriptions.Item label="Average"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterCycles.avg, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Min"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterCycles.min, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Max"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterCycles.max, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds)}/></Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Memory</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMemoryMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration)}/></Descriptions.Item>
                        <Descriptions.Item label="Average"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterMemorySize.avg, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Min"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterMemorySize.min, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Max"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterMemorySize.max, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds)}/></Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Heap Memory</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getHeapMemoryMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration)}/></Descriptions.Item>
                        <Descriptions.Item label="Average"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterHeapMemorySize.avg, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Min"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterHeapMemorySize.min, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds)}/></Descriptions.Item>
                        <Descriptions.Item label="Max"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics?.canisterHeapMemorySize.max, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds)}/></Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </PageHeader>
        <PageHeader title={"Hourly Charts"}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<Array<ChartHourlyDataSource> | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                     data={canisterCyclesAggregatedDataHourly}
                                                                                                                     parameters={{
                                                                                                                         chartTitle: "Cycles",
                                                                                                                         yAxisTitle: "Count"
                                                                                                                     }}
                                                                                                                     highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForHourlyChart}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Cycles"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<Array<ChartHourlyDataSource> | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                     data={canisterUpdateCallsAggregatedDataHourly}
                                                                                                                     parameters={{
                                                                                                                         chartTitle: "Update Calls",
                                                                                                                         yAxisTitle: "Count"
                                                                                                                     }}
                                                                                                                     highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForHourlyChart}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Update Calls"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<Array<ChartHourlyDataSource> | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                     data={canisterMemoryAggregatedDataHourly}
                                                                                                                     parameters={{
                                                                                                                         chartTitle: "Memory Size",
                                                                                                                         yAxisTitle: "Bytes",
                                                                                                                         tooltipValuePostfix: " bytes"
                                                                                                                     }}
                                                                                                                     highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForHourlyChart}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Memory Size"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<Array<ChartHourlyDataSource> | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                     data={canisterHeapMemoryAggregatedDataHourly}
                                                                                                                     parameters={{
                                                                                                                         chartTitle: "Heap Memory Size",
                                                                                                                         yAxisTitle: "Bytes",
                                                                                                                         tooltipValuePostfix: " bytes"
                                                                                                                     }}
                                                                                                                     highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForHourlyChart}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Heap Memory Size"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageHeader>
        <PageHeader title={"Daily Charts"}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<ChartDailyData | undefined, ChartOptionsParams> error={canisterError}
                                                                                                       data={HighchartsUtils.prepareChartDailyData(dataDailyMetrics, source => source.updateCalls)}
                                                                                                       parameters={{
                                                                                                           chartTitle: "Update Calls Daily",
                                                                                                           yAxisTitle: "Count"
                                                                                                       }}
                                                                                                       highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForDailyChart}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Update Calls Daily"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<DailyChartWithNumericEntityData | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                        data={HighchartsUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterCycles)}
                                                                                                                        parameters={{
                                                                                                                            chartTitle: "Cycles Daily",
                                                                                                                            yAxisTitle: "Count"
                                                                                                                        }}
                                                                                                                        highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Cycles Daily"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<DailyChartWithNumericEntityData | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                        data={HighchartsUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterMemorySize)}
                                                                                                                        parameters={{
                                                                                                                            chartTitle: "Memory Daily",
                                                                                                                            yAxisTitle: "Bytes",
                                                                                                                            tooltipValuePostfix: " bytes"
                                                                                                                        }}
                                                                                                                        highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Memory Daily"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <HighchartsOptionsProvider<DailyChartWithNumericEntityData | undefined, ChartOptionsParams> error={canisterError}
                                                                                                                        data={HighchartsUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterHeapMemorySize)}
                                                                                                                        parameters={{
                                                                                                                            chartTitle: "Heap Memory Daily",
                                                                                                                            yAxisTitle: "Bytes",
                                                                                                                            tooltipValuePostfix: " bytes"
                                                                                                                        }}
                                                                                                                        highchartsOptionsProviderFn={HighchartsUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <HighchartsOptionsContext.Consumer>
                                    {context => {
                                        return <HighchartsComponentWrapper highchartsOptionsState={context.state} inProgress={canisterInProgress} chartIdentifier={"Heap Memory Daily"}/>
                                    }}
                                </HighchartsOptionsContext.Consumer>
                            </HighchartsOptionsProvider>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageHeader>
    </>
}