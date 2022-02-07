"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeUtils = void 0;
// import Moment from 'moment';
const moment_timezone_1 = __importDefault(require("moment-timezone"));
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
    }
};
//# sourceMappingURL=DateTimeUtils.js.map