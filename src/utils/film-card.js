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

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (filmA, filmB) => {

  const weight = getWeightForNullDate(filmA.releaseDate, filmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return filmA.releaseDate.getTime() - filmB.releaseDate.getTime();
};

export const sortByRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return filmB.rating - filmA.rating;
};
