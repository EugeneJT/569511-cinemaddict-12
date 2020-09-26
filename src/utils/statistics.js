import moment from "moment";

const periodToFilterMap = {
  [`all-time`]: (cards) => cards,
  [`today`]: (cards) => cards.filter((filmCard) => moment(filmCard.watchingDate).isBetween(moment().startOf(`day`), moment().endOf(`day`))),
  [`week`]: (cards) => cards.filter((filmCard) => moment(filmCard.watchingDate).isBetween(moment().startOf(`week`), moment().endOf(`week`))),
  [`month`]: (cards) => cards.filter((filmCard) => moment(filmCard.watchingDate).isBetween(moment().startOf(`month`), moment().endOf(`month`))),
  [`year`]: (cards) => cards.filter((filmCard) => moment(filmCard.watchingDate).isBetween(moment().startOf(`year`), moment().endOf(`year`)))
};

export const countWatchedFilms = (films) => {
  return (films.length !== 0) ? films.filter((filmCard) => filmCard.isWatched) : 0;
};

export const countDuration = (films) => {
  const totalDuration = films.reduce((acc, current) => acc + current.duration, 0);
  const momentTotal = moment.duration(totalDuration, `minutes`);

  return {
    hours: momentTotal.hours(),
    minutes: momentTotal.minutes(),
  };
};

export const findTopGenre = (films) => {
  if (films.length === 0) {
    return ``;
  }

  const totalGenres = films.reduce((acc, current) => [...acc, ...current.genres], []);
  const uniqueGenres = [...new Set(totalGenres)];

  const genresMap = {};
  uniqueGenres.forEach((uniqueGenre) => {
    genresMap[uniqueGenre] = totalGenres.filter((genre) => genre === uniqueGenre).length;
  });

  return Object.entries(genresMap).sort((a, b) => {
    if ((b[1] - a[1]) === 0) {

      if (b[0][0] > a[0][0]) {
        return -1;
      } else {
        return 1;
      }

    } else {
      return b[1] - a[1];
    }
  });
};

export const countWatchedInPeriod = (data) => {
  const period = data.period;
  const watchedFilms = countWatchedFilms(data.cards);

  // Return array of cards watched in specific period or empty array if nothing has been find
  return periodToFilterMap[period](watchedFilms);
};
