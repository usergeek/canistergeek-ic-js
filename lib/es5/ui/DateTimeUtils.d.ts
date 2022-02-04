import Moment from 'moment-timezone';
export declare type DateTimeFormatterType = "day" | "dayTime";
export declare const DateTimeUtils: {
    getMomentFromCurrentTime: () => Moment.Moment;
    getMomentFromCurrentEndOfDay: () => Moment.Moment;
    formatDate: (timeMillis: number, type: DateTimeFormatterType) => string;
};
