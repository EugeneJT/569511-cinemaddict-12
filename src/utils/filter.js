import {FilterType} from "../const.js";
const {ALL, WATCHLIST, HISTORY, FAVORITES} = FilterType;

export const filterRules = {
  [ALL]: (film) => film,
  [WATCHLIST]: (film) => film.isWatchList,
  [HISTORY]: (film) => film.isWatched,
  [FAVORITES]: (film) => film.isFavorites
};

const addFilteredFilmsCount = (filter, rule) => {
  return (rule) ? (filter || 0) + 1 : filter || 0;
};

export const getFiltersCount = (films) => {
  if (films.length === 0) {
    return {
      watchlist: 0,
      history: 0,
      favorites: 0
    };
  }

  return films.reduce((filter, film) => {
    filter[WATCHLIST] = addFilteredFilmsCount(filter[WATCHLIST], filterRules[WATCHLIST](film));
    filter[HISTORY] = addFilteredFilmsCount(filter[HISTORY], filterRules[HISTORY](film));
    filter[FAVORITES] = addFilteredFilmsCount(filter[FAVORITES], filterRules[FAVORITES](film));

    return filter;
  }, {});
};
