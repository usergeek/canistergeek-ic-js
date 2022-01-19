"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighchartsDateTimeFacade = void 0;
/**
 https://api.highcharts.com/class-reference/Highcharts#.dateFormat

 Defaults
 {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%e. %b',
        week: '%e. %b',
        month: '%b \'%y',
        year: '%Y'
    }
 */
const HighchartsDateFormats = {
    HourMinuteUS: "%l:%M%P",
    DayMonthUS: "%m/%d",
    DayNameMonthDay: "%a, %b %e",
    DayNameMonthDayTime: "%a, %b %e, %l:%M%P", //Sunday, May 3, 12:56
};
const DateFormatByFunctionality = {
    Common: {
        tooltip: {
            hourly: HighchartsDateFormats.DayNameMonthDayTime,
            daily: HighchartsDateFormats.DayNameMonthDay,
        },
        xAxis: {
            dateTimeLabelFormats: {
                day: HighchartsDateFormats.DayMonthUS,
                hour: HighchartsDateFormats.HourMinuteUS,
                minute: HighchartsDateFormats.HourMinuteUS,
            }
        },
    }
};
exports.HighchartsDateTimeFacade = {
    DateFormatByFunctionality: DateFormatByFunctionality
};
//# sourceMappingURL=HighchartsDateTimeFacade.js.map