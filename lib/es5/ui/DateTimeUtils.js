"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeUtils = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Constants_1 = require("../dataProvider/Constants");
const lodash_1 = __importDefault(require("lodash"));
moment_timezone_1.default.locale("en");
moment_timezone_1.default.tz.setDefault("UTC");
const DateTimeFormatterDay = Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
});
const DateTimeFormatterDayTime = Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
});
const getDayHourMinSec = (millis) => {
    const days = Math.floor(millis / Constants_1.DAY_MILLIS);
    const millisFromDayStart = millis % Constants_1.DAY_MILLIS;
    const secondsFromDayStart = millisFromDayStart / 1000;
    const hours = Math.floor(secondsFromDayStart / 3600);
    const minutes = Math.floor((secondsFromDayStart % 3600) / 60);
    const seconds = Math.floor(secondsFromDayStart % 60);
    return {
        days,
        hours,
        minutes,
        seconds
    };
};
const isDisabledDateForDatePicker = (calendarMillis, validRange) => {
    if (calendarMillis != undefined && validRange.minMillis != undefined && validRange.maxMillis != undefined) {
        const dayIndex = Math.floor(calendarMillis / Constants_1.DAY_MILLIS);
        const minMillisDayIndex = Math.floor(validRange.minMillis / Constants_1.DAY_MILLIS);
        const maxMillisDayIndex = Math.floor(validRange.maxMillis / Constants_1.DAY_MILLIS);
        const isDayBefore = dayIndex < minMillisDayIndex;
        const isDayAfter = dayIndex > maxMillisDayIndex;
        return isDayBefore || isDayAfter;
    }
    return false;
};
const getDisabledTimesForDatePicker = (calendarMillis, validRange) => {
    if (calendarMillis != undefined && validRange.minMillis != undefined && validRange.maxMillis != undefined) {
        const dayIndex = Math.floor(calendarMillis / Constants_1.DAY_MILLIS);
        const minMillisDayIndex = Math.floor(validRange.minMillis / Constants_1.DAY_MILLIS);
        const maxMillisDayIndex = Math.floor(validRange.maxMillis / Constants_1.DAY_MILLIS);
        const isDayBefore = dayIndex < minMillisDayIndex;
        const isDayAfter = dayIndex > maxMillisDayIndex;
        if (isDayBefore || isDayAfter) {
            //disable all times
            return {
                disabledHours: () => lodash_1.default.range(0, 24),
                disabledMinutes: (hour) => lodash_1.default.range(0, 60),
                disabledSeconds: (hour) => lodash_1.default.range(0, 60),
            };
        }
        const isMinDay = dayIndex == minMillisDayIndex;
        if (isMinDay) {
            const hms = getDayHourMinSec(validRange.minMillis);
            return {
                disabledHours: () => lodash_1.default.range(0, hms.hours),
                disabledMinutes: (hour) => {
                    if (hour < hms.hours) {
                        return lodash_1.default.range(0, 60);
                    }
                    else if (hour == hms.hours) {
                        return lodash_1.default.range(0, hms.minutes);
                    }
                    return [];
                },
                disabledSeconds: (hour, minute) => {
                    if (hour < hms.hours) {
                        return lodash_1.default.range(0, 60);
                    }
                    else if (hour == hms.hours) {
                        if (minute < hms.minutes) {
                            return lodash_1.default.range(0, 60);
                        }
                        else if (minute == hms.minutes) {
                            return lodash_1.default.range(0, hms.seconds - 1);
                        }
                    }
                    return [];
                }
            };
        }
        const isMaxDay = dayIndex == maxMillisDayIndex;
        if (isMaxDay) {
            const hms = getDayHourMinSec(validRange.maxMillis);
            return {
                disabledHours: () => lodash_1.default.range(hms.hours + 1, 24),
                disabledMinutes: (hour) => {
                    if (hour > hms.hours) {
                        return lodash_1.default.range(0, 60);
                    }
                    else if (hour == hms.hours) {
                        return lodash_1.default.range(hms.minutes + 1, 60);
                    }
                    return [];
                },
                disabledSeconds: (hour, minute) => {
                    if (hour > hms.hours) {
                        return lodash_1.default.range(0, 60);
                    }
                    else if (hour == hms.hours) {
                        if (minute > hms.minutes) {
                            return lodash_1.default.range(0, 60);
                        }
                        else if (minute == hms.minutes) {
                            return lodash_1.default.range(hms.seconds + 1, 60);
                        }
                    }
                    return [];
                }
            };
        }
    }
    return {
        disabledHours: () => [],
        disabledMinutes: (hour) => [],
        disabledSeconds: (hour) => []
    };
};
const fromNanosToMillis = (value) => Math.floor(Number(value) / Constants_1.NANOS_IN_MILLIS);
exports.DateTimeUtils = {
    getMomentFromCurrentTime: () => (0, moment_timezone_1.default)(),
    getMomentFromCurrentEndOfDay: () => exports.DateTimeUtils.getMomentFromCurrentTime().endOf('day'),
    formatDate: (timeMillis, type) => {
        switch (type) {
            case "day":
                return DateTimeFormatterDay.format(timeMillis);
            case "dayTime":
                return DateTimeFormatterDayTime.format(timeMillis);
        }
    },
    getDayHourMinSec: getDayHourMinSec,
    isDisabledDateForDatePicker: isDisabledDateForDatePicker,
    getDisabledTimesForDatePicker: getDisabledTimesForDatePicker,
    fromNanosToMillis: fromNanosToMillis,
};
//# sourceMappingURL=DateTimeUtils.js.map