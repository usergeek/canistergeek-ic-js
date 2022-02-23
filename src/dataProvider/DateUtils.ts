import {DAY_MILLIS, GRANULARITY_SECONDS, HOUR_MILLIS} from "./Constants";

const nowTimeUTC = () => new Date().getTime()

const getStartOfDayMilliseconds = (time: number): number => time - (time % DAY_MILLIS)

const getStartOfTodayMilliseconds = (): number => {
    const time = nowTimeUTC()
    return time - (time % DAY_MILLIS)
}

const getSecondsFromTodayStart = (): number => Math.floor((nowTimeUTC() % DAY_MILLIS) / 1000)

const getMetricIntervalIndex = (secondsFromDayStart: number) => Math.floor(secondsFromDayStart / GRANULARITY_SECONDS)

const getMetricIntervalIndexForCurrentTime = () => getMetricIntervalIndex(getSecondsFromTodayStart())

export type DateDifference = {
    milliseconds: number
    seconds: number
    minutes: number
    hours: number
    days: number
}

const getDifferenceBetweenToMillis = (fromMillis: number, toMillis: number): DateDifference => {
    const diffMilliseconds = toMillis - fromMillis
    const diffSeconds = Math.floor(diffMilliseconds / 1000)
    const diffDays = Math.floor(diffMilliseconds / DAY_MILLIS)
    const diffHours = Math.floor(diffMilliseconds % DAY_MILLIS / HOUR_MILLIS)
    const diffMinutes = Math.round((diffMilliseconds % DAY_MILLIS % HOUR_MILLIS) / 60000);
    return {
        milliseconds: diffMilliseconds,
        seconds: diffSeconds,
        minutes: diffMinutes,
        hours: diffHours,
        days: diffDays
    }
}

const formatDifferencesBetweenToMillis = (diff: DateDifference): string => {
    const result: Array<string> = []
    if (diff.days > 0) {
        result.push(`${diff.days}d`)
    }
    if (diff.hours > 0) {
        result.push(`${diff.hours}h`)
    }
    if (diff.minutes > 0) {
        result.push(`${diff.minutes}m`)
    }
    if (result.length == 0 && diff.seconds > 0) {
        result.push(`${diff.seconds}s`)
    }
    return result.join(" ")
}

export const DateUtils = {
    nowTimeUTC: nowTimeUTC,
    getMetricIntervalIndexForCurrentTime: getMetricIntervalIndexForCurrentTime,
    getStartOfDayMilliseconds: getStartOfDayMilliseconds,
    getStartOfTodayMilliseconds: getStartOfTodayMilliseconds,
    Diff: {
        getDifferenceBetweenToMillis: getDifferenceBetweenToMillis,
        Formatter: {
            formatDifferencesBetweenToMillis: formatDifferencesBetweenToMillis
        }
    }
}
