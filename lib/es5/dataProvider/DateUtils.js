"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const Constants_1 = require("./Constants");
const nowTimeUTC = () => new Date().getTime();
const getStartOfDayMilliseconds = (time) => time - (time % Constants_1.DAY_MILLIS);
const getStartOfTodayMilliseconds = () => {
    const time = nowTimeUTC();
    return time - (time % Constants_1.DAY_MILLIS);
};
const getSecondsFromTodayStart = () => Math.floor((nowTimeUTC() % Constants_1.DAY_MILLIS) / 1000);
const getMetricIntervalIndex = (secondsFromDayStart) => Math.floor(secondsFromDayStart / Constants_1.GRANULARITY_SECONDS);
const getMetricIntervalIndexForCurrentTime = () => getMetricIntervalIndex(getSecondsFromTodayStart());
const getDifferenceBetweenToMillis = (fromMillis, toMillis) => {
    const diffMilliseconds = toMillis - fromMillis;
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffDays = Math.floor(diffMilliseconds / Constants_1.DAY_MILLIS);
    const diffHours = Math.floor(diffMilliseconds % Constants_1.DAY_MILLIS / Constants_1.HOUR_MILLIS);
    const diffMinutes = Math.round((diffMilliseconds % Constants_1.DAY_MILLIS % Constants_1.HOUR_MILLIS) / 60000);
    return {
        milliseconds: diffMilliseconds,
        seconds: diffSeconds,
        minutes: diffMinutes,
        hours: diffHours,
        days: diffDays
    };
};
const formatDifferencesBetweenToMillis = (diff) => {
    const result = [];
    if (diff.days > 0) {
        result.push(`${diff.days}d`);
    }
    if (diff.hours > 0) {
        result.push(`${diff.hours}h`);
    }
    if (diff.minutes > 0) {
        result.push(`${diff.minutes}m`);
    }
    if (result.length == 0 && diff.seconds > 0) {
        result.push(`${diff.seconds}s`);
    }
    return result.join(" ");
};
exports.DateUtils = {
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
};
//# sourceMappingURL=DateUtils.js.map