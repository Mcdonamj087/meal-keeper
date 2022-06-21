import {format} from 'date-fns';

/**
 * @desc    Formats a date string and returns the new format
 * @param {Number|Date} dateValue - A timestamp (in milliseconds), or Date object
 * @param {string} outputFormat - Optionally set the output format
 * @return {string} - The newly formatted date string
 */

export const formatDate = (
  dateValue?: number | Date | null,
  outputFormat: string = "LLL d, y'T'HH:mm:ss"
): string => {
  const date = dateValue ? dateValue : new Date();
  return format(date, outputFormat);
};
