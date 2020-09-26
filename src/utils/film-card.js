import moment from "moment";

export const formatDurationFilmDate = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  const durationHours = `${duration.hours() > 0 ? `${duration.hours()}h` : ``}`;
  const durationMinutes = `${duration.minutes() > 0 ? `${duration.minutes()}m` : ``}`;

  return `${durationHours} ${durationMinutes}`;
};

export const formatFilmDate = (dateTime, dateType) => {
  return moment(dateTime).format(dateType);
};

export const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

export const formatYear = (dateObject) => {
  return dateObject.getFullYear();
};
