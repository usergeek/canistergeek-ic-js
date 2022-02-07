// import Moment from 'moment';
import Moment from 'moment-timezone';

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
    }
}