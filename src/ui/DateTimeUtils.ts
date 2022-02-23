import Moment from 'moment-timezone';
import {DisabledTimes} from "rc-picker/lib/interface";
import {DAY_MILLIS, NANOS_IN_MILLIS} from "../dataProvider/Constants";
import _ from "lodash"

Moment.locale("en");
Moment.tz.setDefault("UTC");

export type DateTimeFormatterType = "day" | "dayTime"

const DateTimeFormatterDay = Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
})

const DateTimeFormatterDayTime = Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
})

const getDayHourMinSec = (millis: number): { days: number, hours: number, minutes: number, seconds: number } => {
    const days = Math.floor(millis / DAY_MILLIS)
    const millisFromDayStart = millis % DAY_MILLIS
    const secondsFromDayStart = millisFromDayStart / 1000
    const hours = Math.floor(secondsFromDayStart / 3600)
    const minutes = Math.floor((secondsFromDayStart % 3600) / 60)
    const seconds = Math.floor(secondsFromDayStart % 60)
    return {
        days,
        hours,
        minutes,
        seconds
    }
}

const isDisabledDateForDatePicker = (calendarMillis: number | undefined, validRange: { minMillis?: number, maxMillis?: number }): boolean => {
    if (calendarMillis != undefined && validRange.minMillis != undefined && validRange.maxMillis != undefined) {
        const dayIndex = Math.floor(calendarMillis / DAY_MILLIS)
        const minMillisDayIndex = Math.floor(validRange.minMillis / DAY_MILLIS)
        const maxMillisDayIndex = Math.floor(validRange.maxMillis / DAY_MILLIS)
        const isDayBefore = dayIndex < minMillisDayIndex
        const isDayAfter = dayIndex > maxMillisDayIndex
        return isDayBefore || isDayAfter
    }
    return false
}

const getDisabledTimesForDatePicker = (calendarMillis: number | undefined, validRange: { minMillis?: number, maxMillis?: number }): DisabledTimes => {
    if (calendarMillis != undefined && validRange.minMillis != undefined && validRange.maxMillis != undefined) {
        const dayIndex = Math.floor(calendarMillis / DAY_MILLIS)
        const minMillisDayIndex = Math.floor(validRange.minMillis / DAY_MILLIS)
        const maxMillisDayIndex = Math.floor(validRange.maxMillis / DAY_MILLIS)
        const isDayBefore = dayIndex < minMillisDayIndex
        const isDayAfter = dayIndex > maxMillisDayIndex
        if (isDayBefore || isDayAfter) {
            //disable all times
            return {
                disabledHours: () => _.range(0, 24),
                disabledMinutes: (hour) => _.range(0, 60),
                disabledSeconds: (hour) => _.range(0, 60),
            }
        }
        const isMinDay = dayIndex == minMillisDayIndex
        if (isMinDay) {
            const hms = getDayHourMinSec(validRange.minMillis)
            return {
                disabledHours: () => _.range(0, hms.hours),
                disabledMinutes: (hour) => {
                    if (hour < hms.hours) {
                        return _.range(0, 60)
                    } else if (hour == hms.hours) {
                        return _.range(0, hms.minutes)
                    }
                    return []
                },
                disabledSeconds: (hour: number, minute: number) => {
                    if (hour < hms.hours) {
                        return _.range(0, 60)
                    } else if (hour == hms.hours) {
                        if (minute < hms.minutes) {
                            return _.range(0, 60)
                        } else if (minute == hms.minutes) {
                            return _.range(0, hms.seconds - 1)
                        }
                    }
                    return []
                }
            }
        }
        const isMaxDay = dayIndex == maxMillisDayIndex
        if (isMaxDay) {
            const hms = getDayHourMinSec(validRange.maxMillis)
            return {
                disabledHours: () => _.range(hms.hours + 1, 24),
                disabledMinutes: (hour) => {
                    if (hour > hms.hours) {
                        return _.range(0, 60)
                    } else if (hour == hms.hours) {
                        return _.range(hms.minutes + 1, 60)
                    }
                    return []
                },
                disabledSeconds: (hour: number, minute: number) => {
                    if (hour > hms.hours) {
                        return _.range(0, 60)
                    } else if (hour == hms.hours) {
                        if (minute > hms.minutes) {
                            return _.range(0, 60)
                        } else if (minute == hms.minutes) {
                            return _.range(hms.seconds + 1, 60)
                        }
                    }
                    return []
                }
            }
        }
    }
    return {
        disabledHours: () => [],
        disabledMinutes: (hour) => [],
        disabledSeconds: (hour) => []
    }
}

const fromNanosToMillis = (value: bigint): number => Math.floor(Number(value) / NANOS_IN_MILLIS)

export const DateTimeUtils = {
    getMomentFromCurrentTime: () => Moment(),
    getMomentFromCurrentEndOfDay: () => DateTimeUtils.getMomentFromCurrentTime().endOf('day'),
    formatDate: (timeMillis: number, type: DateTimeFormatterType): string => {
        switch (type) {
            case "day":
                return DateTimeFormatterDay.format(timeMillis)
            case "dayTime":
                return DateTimeFormatterDayTime.format(timeMillis)
        }
    },
    getDayHourMinSec: getDayHourMinSec,
    isDisabledDateForDatePicker: isDisabledDateForDatePicker,
    getDisabledTimesForDatePicker: getDisabledTimesForDatePicker,
    fromNanosToMillis: fromNanosToMillis,
}