/* eslint-disable import/prefer-default-export */
import dayJS from 'dayjs';

function timestampFormatter(format) {

  function formatDateTime(timestamp = Date.now()) {
    /** If timestamp is equal to true, return the current time */
    if (timestamp === true) {
      return formatDateTime(Date.now());
    }

    /** If timestamp is not a number or format doesn't exists return blank */
    if (!format || typeof timestamp !== 'number') {
      return '';
    }

    /** Return formatted Time */
    return dayJS(timestamp).format(format);
  }

  return formatDateTime;

}

export { timestampFormatter };
