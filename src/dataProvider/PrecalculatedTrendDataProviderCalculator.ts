import {PrecalculatedData, SummaryPageTrendSectionData, TrendSection24HoursData, TrendSection24HoursInterval, TrendSectionShiftData, TrendSectionShiftsData} from "./PrecalculatedTrendDataProvider";
import {DAY_INTERVALS_COUNT, DAY_MILLIS, GRANULARITY_SECONDS} from "./Constants";
import {HourlyMetricsData} from "../api/canistergeek.did";
import _ from "lodash";
import {CalculationUtils} from "../dataProvider/CalculationUtils";
import {ContextDataHourly} from "./DataProvider";
import {DateUtils} from "./DateUtils";

export type PairOfDaysDataForFull24HoursInterval = {
    from: HourlyMetricsData
    to: HourlyMetricsData
}

const getPairOfDaysDataForFull24HoursIntervalFromNow = (dataHourlyMetrics: Array<HourlyMetricsData>, numberOfShiftsBy24Hours: number): PairOfDaysDataForFull24HoursInterval | undefined => {
    const nowTimeUTC = DateUtils.nowTimeUTC();

    const dayTo_millis = nowTimeUTC - (DAY_MILLIS * numberOfShiftsBy24Hours)
    const dayTo_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(dayTo_millis);
    let dayTo_data: HourlyMetricsData = dataHourlyMetrics.find(value => Number(value.timeMillis) == dayTo_startOfDayMilliseconds)

    const dayFrom_startOfDayMilliseconds = dayTo_startOfDayMilliseconds - DAY_MILLIS
    let dayFrom_data: HourlyMetricsData = dataHourlyMetrics.find(value => Number(value.timeMillis) == dayFrom_startOfDayMilliseconds)

    if (dayTo_data || dayFrom_data) {
        if (!dayTo_data) {
            //mock dayTo_data as empty structure
            const array = new Array(DAY_INTERVALS_COUNT).fill(BigInt(0))
            dayTo_data = {timeMillis: BigInt(dayTo_startOfDayMilliseconds), updateCalls: array, canisterCycles: array, canisterMemorySize: array, canisterHeapMemorySize: array}
        }
        if (!dayFrom_data) {
            //mock dayFrom_data as empty structure
            const array = new Array(DAY_INTERVALS_COUNT).fill(BigInt(0))
            dayFrom_data = {timeMillis: BigInt(dayFrom_startOfDayMilliseconds), updateCalls: array, canisterCycles: array, canisterMemorySize: array, canisterHeapMemorySize: array}
        }
        return {
            from: dayFrom_data,
            to: dayTo_data
        }
    }
    return undefined
}

const calculateTrendSection24HoursData = (data: PairOfDaysDataForFull24HoursInterval, metricIntervalIndex: number): TrendSection24HoursData => {
    const index = metricIntervalIndex + 1
    const from_targetMillis = Number(data.from.timeMillis) + (index * GRANULARITY_SECONDS * 1000)
    const to_targetMillis = Number(data.to.timeMillis) + ((index - 1) * GRANULARITY_SECONDS * 1000)

    const hourlyMetricsData: HourlyMetricsData = {
        updateCalls: _.concat(
            _.slice(data.from.updateCalls, index),
            _.slice(data.to.updateCalls, 0, index)
        ),
        canisterCycles: _.concat(
            _.slice(data.from.canisterCycles, index),
            _.slice(data.to.canisterCycles, 0, index)
        ),
        canisterMemorySize: _.concat(
            _.slice(data.from.canisterMemorySize, index),
            _.slice(data.to.canisterMemorySize, 0, index)
        ),
        canisterHeapMemorySize: _.concat(
            _.slice(data.from.canisterHeapMemorySize, index),
            _.slice(data.to.canisterHeapMemorySize, 0, index)
        ),
        timeMillis: BigInt(0)
    }

    ////////////////////////////////////////////////
    // last24HoursTrendData
    ////////////////////////////////////////////////

    const updateCallsTotal = CalculationUtils.sumArray(hourlyMetricsData.updateCalls)
    const cyclesDifference = Number(CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterCycles))
    const cyclesDifferenceInDollars = CalculationUtils.recalculateCyclesToDollars(cyclesDifference)
    const memoryDifference = Number(CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterMemorySize))
    const heapMemoryDifference = Number(CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterHeapMemorySize))

    return {
        interval: {
            fromMillis: from_targetMillis,
            toMillis: to_targetMillis
        },
        updateCalls: updateCallsTotal,
        cyclesDifference: cyclesDifference,
        cyclesDifferenceInDollars: cyclesDifferenceInDollars,
        memoryDifference: memoryDifference,
        heapMemoryDifference: heapMemoryDifference
    };
}


const createTrendSection24HoursIntervalForDay = (startOfDayMilliseconds: number, metricIntervalIndex: number): TrendSection24HoursInterval => {
    const index = metricIntervalIndex + 1
    const from_targetMillis = Number(startOfDayMilliseconds - DAY_MILLIS) + (index * GRANULARITY_SECONDS * 1000)
    const to_targetMillis = Number(startOfDayMilliseconds) + ((index - 1) * GRANULARITY_SECONDS * 1000)
    return {
        fromMillis: from_targetMillis,
        toMillis: to_targetMillis
    }
}

const getPrecalculatedData = (dataHourly: ContextDataHourly): PrecalculatedData => {
    return _.mapKeys<SummaryPageTrendSectionData>(_.compact<SummaryPageTrendSectionData>(_.map<ContextDataHourly, SummaryPageTrendSectionData | undefined>(dataHourly, (hourlyMetricsData, canisterId) => {
        if (hourlyMetricsData && hourlyMetricsData.length > 0) {
            const metricIntervalIndexForCurrentTime = DateUtils.getMetricIntervalIndexForCurrentTime();
            const today24HoursInterval: TrendSection24HoursInterval = createTrendSection24HoursIntervalForDay(DateUtils.getStartOfDayMilliseconds(DateUtils.nowTimeUTC()), metricIntervalIndexForCurrentTime)
            const full24HoursIntervalShifts: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7]

            ////////////////////////////////////////////////
            // Shifts trend data
            ////////////////////////////////////////////////

            const create24HoursInterval = (baseInterval: TrendSection24HoursInterval, numberOfShiftsBy24Hours: number): TrendSection24HoursInterval => {
                const shiftMillis = numberOfShiftsBy24Hours * DAY_MILLIS;
                return {
                    fromMillis: baseInterval.fromMillis - shiftMillis,
                    toMillis: baseInterval.toMillis - shiftMillis,
                }
            }

            type Full24HoursPairDataForShiftsItem = { numberOfShiftsBy24Hours: number, pair: PairOfDaysDataForFull24HoursInterval | undefined }
            const full24HoursPairDataForShifts: Array<Full24HoursPairDataForShiftsItem> = full24HoursIntervalShifts.map<Full24HoursPairDataForShiftsItem>(numberOfShiftsBy24Hours => {
                return {
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    pair: getPairOfDaysDataForFull24HoursIntervalFromNow(hourlyMetricsData, numberOfShiftsBy24Hours)
                }
            })

            const updateCallsTrendSectionShiftData: Array<TrendSectionShiftData> = []
            const cyclesDifferenceTrendSectionShiftData: Array<TrendSectionShiftData> = []
            const cyclesDifferenceInDollarsTrendSectionShiftData: Array<TrendSectionShiftData> = []
            const memoryDifferenceTrendSectionShiftData: Array<TrendSectionShiftData> = []
            const heapMemoryDifferenceTrendSectionShiftData: Array<TrendSectionShiftData> = []
            _.each<Full24HoursPairDataForShiftsItem>(full24HoursPairDataForShifts, (pairData) => {
                const numberOfShiftsBy24Hours = pairData.numberOfShiftsBy24Hours;
                const trendSection24HoursData: TrendSection24HoursData | undefined = pairData.pair ? calculateTrendSection24HoursData(pairData.pair, metricIntervalIndexForCurrentTime) : undefined
                const trendSection24HoursIntervalForCurrentShift = create24HoursInterval(today24HoursInterval, numberOfShiftsBy24Hours);

                updateCallsTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData?.updateCalls
                })
                cyclesDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData?.cyclesDifference
                })
                cyclesDifferenceInDollarsTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData?.cyclesDifferenceInDollars
                })
                memoryDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData?.memoryDifference
                })
                heapMemoryDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData?.heapMemoryDifference
                })
            })

            const shiftsData: TrendSectionShiftsData = {
                updateCalls: updateCallsTrendSectionShiftData,
                cycles: {
                    difference: cyclesDifferenceTrendSectionShiftData,
                    differenceInDollars: cyclesDifferenceInDollarsTrendSectionShiftData
                },
                memoryDifference: memoryDifferenceTrendSectionShiftData,
                heapMemoryDifference: heapMemoryDifferenceTrendSectionShiftData
            }

            ////////////////////////////////////////////////
            // Result
            ////////////////////////////////////////////////

            const canisterPrecalculatedData: SummaryPageTrendSectionData = {
                canisterId: canisterId,
                shiftsData: shiftsData,
            }
            return canisterPrecalculatedData
        }
    })), v => v.canisterId)
}

export const PrecalculatedTrendDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
}