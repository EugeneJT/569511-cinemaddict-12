export const generateFilter = (films) => {

  const filter = {
    all: 0,
    watchlist: 0,
    history: 0,
    favorites: 0
  };

  films.forEach((film) => {

    const {isToWatchList, isWatched, isFavorite} = film;

    filter.all++;

    if (isToWatchList) {
      filter.watchlist++;
    }

    if (isWatched) {
      filter.history++;
    }

    if (isFavorite) {
      filter.favorites++;
    }

  });

  return Object.entries(filter).map(([name, count]) => {
    return {name, count};
  });

};
