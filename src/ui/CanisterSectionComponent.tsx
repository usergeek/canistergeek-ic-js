import * as React from "react";
import {Col, Descriptions, PageHeader, Row, Spin, Typography} from "antd";
import {useDataContext} from "../dataProvider/DataProvider";
import {DashboardUtils} from "./DashboardUtils";
import {CanisterMetricsErrorPageAlert} from "./CanisterMetricsErrorPageAlert";
import _ from "lodash"
import {DataProviderUtils} from "../dataProvider/DataProviderUtils";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {SummaryRealtimeSimpleMetricWrapperLabelComponent} from "./SummaryRealtimeSimpleMetricWrapperLabelComponent";
import {PrecalculatedRealtimeDataProviderCalculator} from "../dataProvider/PrecalculatedRealtimeDataProviderCalculator";
import {CanisterMetricsSource, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {ChartJSComponentSupplierContext, ChartJSComponentSupplierProvider} from "./ChartJSComponentSupplierProvider";
import {ChartJSComponentWrapper} from "./ChartJSComponentWrapper";
import {ChartDailyData as ChartJSChartDailyData, ChartHourlyDataSource, ChartJSUtils, ChartOptionsParams as ChartJSChartOptionsParams, DailyChartWithNumericEntityData as ChartJSDailyChartWithNumericEntityData} from "./ChartJSUtils";
import {useCustomCompareEffect} from "use-custom-compare";

type Props = {
    canisterId: string
}

type PropsWithMetricsSource = {
    metricsSource: Array<CanisterMetricsSource> | undefined
}

export const CanisterSectionComponentCanisterSource = (props: Props & PropsWithMetricsSource) => {
    const canisterId = props.canisterId;

    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const metricsSource = props.metricsSource

    const canisterError = dataContext.error[canisterId]
    const canisterInProgress = dataContext.status[canisterId]?.inProgress

    useCustomCompareEffect(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getCanisterPageParams(canisterId, metricsSource))
    }, [dataContext.getCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

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
                            <ChartJSComponentSupplierProvider<Array<ChartHourlyDataSource> | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                   data={canisterCyclesAggregatedDataHourly}
                                                                                                                                   parameters={{
                                                                                                                                       chartTitle: "Cycles",
                                                                                                                                       yAxisTitle: "Count"
                                                                                                                                   }}
                                                                                                                                   chartContextProviderFn={ChartJSUtils.provideCommonOptionsForHourlyChart}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Cycles"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<Array<ChartHourlyDataSource> | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                   data={canisterUpdateCallsAggregatedDataHourly}
                                                                                                                                   parameters={{
                                                                                                                                       chartTitle: "Update Calls",
                                                                                                                                       yAxisTitle: "Count"
                                                                                                                                   }}
                                                                                                                                   chartContextProviderFn={ChartJSUtils.provideCommonOptionsForHourlyChart}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Update Calls"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<Array<ChartHourlyDataSource> | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                   data={canisterMemoryAggregatedDataHourly}
                                                                                                                                   parameters={{
                                                                                                                                       chartTitle: "Memory Size",
                                                                                                                                       yAxisTitle: "Bytes",
                                                                                                                                       tooltipValuePostfix: " bytes"
                                                                                                                                   }}
                                                                                                                                   chartContextProviderFn={ChartJSUtils.provideCommonOptionsForHourlyChart}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Memory Size"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<Array<ChartHourlyDataSource> | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                   data={canisterHeapMemoryAggregatedDataHourly}
                                                                                                                                   parameters={{
                                                                                                                                       chartTitle: "Heap Memory Size",
                                                                                                                                       yAxisTitle: "Bytes",
                                                                                                                                       tooltipValuePostfix: " bytes"
                                                                                                                                   }}
                                                                                                                                   chartContextProviderFn={ChartJSUtils.provideCommonOptionsForHourlyChart}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Heap Memory Size"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
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
                            <ChartJSComponentSupplierProvider<ChartJSChartDailyData | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                            data={ChartJSUtils.prepareChartDailyData(dataDailyMetrics, source => source.updateCalls)}
                                                                                                                            parameters={{
                                                                                                                                chartTitle: "Update Calls Daily",
                                                                                                                                yAxisTitle: "Count"
                                                                                                                            }}
                                                                                                                            chartContextProviderFn={ChartJSUtils.provideCommonOptionsForDailyChart}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Update Calls Daily"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<ChartJSDailyChartWithNumericEntityData | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                             data={ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterCycles)}
                                                                                                                                             parameters={{
                                                                                                                                                 chartTitle: "Cycles Daily",
                                                                                                                                                 yAxisTitle: "Count"
                                                                                                                                             }}
                                                                                                                                             chartContextProviderFn={ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Cycles Daily"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<ChartJSDailyChartWithNumericEntityData | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                             data={ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterMemorySize)}
                                                                                                                                             parameters={{
                                                                                                                                                 chartTitle: "Memory Daily",
                                                                                                                                                 yAxisTitle: "Bytes",
                                                                                                                                                 tooltipValuePostfix: " bytes"
                                                                                                                                             }}
                                                                                                                                             chartContextProviderFn={ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Memory Daily"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <ChartJSComponentSupplierProvider<ChartJSDailyChartWithNumericEntityData | undefined, ChartJSChartOptionsParams> error={canisterError}
                                                                                                                                             data={ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterHeapMemorySize)}
                                                                                                                                             parameters={{
                                                                                                                                                 chartTitle: "Heap Memory Daily",
                                                                                                                                                 yAxisTitle: "Bytes",
                                                                                                                                                 tooltipValuePostfix: " bytes"
                                                                                                                                             }}
                                                                                                                                             chartContextProviderFn={ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity}>
                                <ChartJSComponentSupplierContext.Consumer>
                                    {context => {
                                        return <ChartJSComponentWrapper supplier={context.state} inProgress={canisterInProgress} chartIdentifier={"Heap Memory Daily"}/>
                                    }}
                                </ChartJSComponentSupplierContext.Consumer>
                            </ChartJSComponentSupplierProvider>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageHeader>
    </>
}

export const CanisterSectionComponentBlackholeSource = (props: Props & PropsWithMetricsSource) => {
    const canisterId = props.canisterId;

    const configurationContext = useConfigurationContext();
    const dataContext = useDataContext();

    const configuration = configurationContext.configuration;
    const metricsSource = props.metricsSource

    const canisterInProgress = dataContext.status[canisterId]?.inProgress

    useCustomCompareEffect(() => {
        dataContext.getCanisterMetrics(DashboardUtils.getCanisterPageParams(canisterId, metricsSource))
    }, [dataContext.getCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const dataBlackhole = dataContext.dataBlackhole;

    const currentCyclesMetricWrapper = PrecalculatedRealtimeDataProviderCalculator.getCyclesMetricWrapperFromBlackholeData(dataBlackhole[canisterId], configuration);
    const currentMemoryMetricWrapper = PrecalculatedRealtimeDataProviderCalculator.getMemoryMetricWrapperFromBlackholeData(dataBlackhole[canisterId], configuration);
    return <>
        <CanisterMetricsErrorPageAlert error={dataContext.error}/>
        <PageHeader title={<>Today {canisterInProgress ? <Spin size={"small"} style={{marginLeft: "15px"}}/> : null}</>}>
            <Row>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Cycles</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={currentCyclesMetricWrapper}/></Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24}>
                    <Descriptions column={6} size={"small"}>
                        <Descriptions.Item><Typography.Title level={5}>Memory</Typography.Title></Descriptions.Item>
                        <Descriptions.Item label="Current"><SummaryRealtimeSimpleMetricWrapperLabelComponent metricWrapper={currentMemoryMetricWrapper}/></Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </PageHeader>
    </>
}

export const CanisterSectionComponent = (props: Props) => {
    const canisterId = props.canisterId;

    const configurationContext = useConfigurationContext();

    const metricsSource = configurationContext.configuration.canisters.find(v => v.canisterId == canisterId)?.metricsSource
    if (DashboardUtils.isMetricsSourceCanister(metricsSource)) {
        return <CanisterSectionComponentCanisterSource canisterId={props.canisterId} metricsSource={metricsSource}/>
    } else if (DashboardUtils.isMetricsSourceBlackhole(metricsSource)) {
        return <CanisterSectionComponentBlackholeSource canisterId={props.canisterId} metricsSource={metricsSource}/>
    }
    return null
}