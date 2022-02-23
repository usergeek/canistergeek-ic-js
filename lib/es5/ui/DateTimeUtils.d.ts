import Moment from 'moment-timezone';
import { DisabledTimes } from "rc-picker/lib/interface";
export declare type DateTimeFormatterType = "day" | "dayTime";
export declare const DateTimeUtils: {
    getMomentFromCurrentTime: () => Moment.Moment;
    getMomentFromCurrentEndOfDay: () => Moment.Moment;
    formatDate: (timeMillis: number, type: DateTimeFormatterType) => string;
    getDayHourMinSec: (millis: number) => {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
    isDisabledDateForDatePicker: (calendarMillis: number | undefined, validRange: {
        minMillis?: number;
        maxMillis?: number;
    }) => boolean;
    getDisabledTimesForDatePicker: (calendarMillis: number | undefined, validRange: {
        minMillis?: number;
        maxMillis?: number;
    }) => DisabledTimes;
    fromNanosToMillis: (value: bigint) => number;
};
