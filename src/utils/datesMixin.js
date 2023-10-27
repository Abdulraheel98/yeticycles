import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone)

export default {
  methods: {
    getFullMonthYear(date) {
      return dayjs(date).format("MMM YYYY")
    },
    getDateWithDayNameAndTimeInUserTimeZone(date) {
      const userTZ = dayjs.tz.guess();
      return dayjs.utc(date).tz(userTZ).format("ddd MM/DD/YYYY h:mm A");
    },
    getDate(date) {
      // Returns as 12/31/2022
      return dayjs(date).format('MM/DD/YYYY');
    },
    getDateAsUTC(date) {
      // Returns as 12/31/2022 regardless of timezones. Helpful for fields that only have date and not time
      const timezoneOffset = (new Date(date)).getTimezoneOffset();

      if (timezoneOffset === 0) {
        return this.getDate(date);
      }
      if (timezoneOffset < 0) {
        return dayjs(date).subtract(timezoneOffset, 'm').format('MM/DD/YYYY')
      }

      return dayjs(date).add(timezoneOffset, 'm').format('MM/DD/YYYY');
    },
    getDateWithTime(date) {
      // Returns as 12/31/2022 10:30 AM
      return dayjs(date).format('MM/DD/YYYY h:mm A');
    },
    getDateWithDayName(date) {
      // Returns as Mon 12/31/2022
      return dayjs(date).format('ddd MM/DD/YYYY');
    },
    getDateWithDayNameAndTime(date) {
      // Returns as Mon 12/31/2022 10:30 AM
      return dayjs(date).format('ddd MM/DD/YYYY h:mm A');
    },
    getDateWithMonthName(date) {
      // Returns as Dec 31, 2022
      return dayjs(date).format('MMM DD, YYYY');
    },
    getDateWithMonthNameAndTime(date) {
      // Returns as Dec 31, 2022 10:30 AM
      return dayjs(date).format('MMM DD, YYYY h:mm A');
    },
    getSystemDateFormat(date) {
      // Returns as 2022-12-31
      return dayjs(date).format('YYYY-MM-DD');
    },
    getSystemDateFormatForHour(date, hour) {
      if(!date) return null
      // Returns as 2022-12-31
      return dayjs(date).hour(hour).format('YYYY-MM-DD');
    },
    getSystemDateFormatWithTime(date) {
      // Returns as 2022-12-31
      return dayjs(date).format('YYYY-MM-DD HH:mm:ssZ[Z]');
    },
  }
};
