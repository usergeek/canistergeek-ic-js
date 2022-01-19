import Moment from 'moment';

Moment.locale("en");

export const DateTimeUtils = {
    getMomentFromCurrentTime: () => Moment(),
    getMomentFromCurrentEndOfDay: () => DateTimeUtils.getMomentFromCurrentTime().endOf('day'),
}