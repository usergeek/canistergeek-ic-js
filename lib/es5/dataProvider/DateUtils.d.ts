export declare type DateDifference = {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
};
export declare const DateUtils: {
    nowTimeUTC: () => number;
    getMetricIntervalIndexForCurrentTime: () => number;
    getStartOfDayMilliseconds: (time: number) => number;
    getStartOfTodayMilliseconds: () => number;
    Diff: {
        getDifferenceBetweenToMillis: (fromMillis: number, toMillis: number) => DateDifference;
        Formatter: {
            formatDifferencesBetweenToMillis: (diff: DateDifference) => string;
        };
    };
};
