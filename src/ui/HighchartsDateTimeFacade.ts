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
    HourMinuteUS: "%l:%M%P",//23.54
    DayMonthUS: "%m/%d",//month zero based, 5.03
    DayNameMonthDay: "%a, %b %e",//Sunday, May 3
    DayNameMonthDayTime: "%a, %b %e, %l:%M%P",//Sunday, May 3, 12:56
}

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
}


export const HighchartsDateTimeFacade = {
    DateFormatByFunctionality: DateFormatByFunctionality
}