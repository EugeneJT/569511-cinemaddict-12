import {getRandomInteger, getRandomFractionInteger, getRandomItem, getRandomItems, getRandomArray} from "../utils.js";
import {FilmsDuration, COMMENT_EMOJIS, COMMENT_USERS, COMMENT_TEXT, FILM_TITLES, FILM_POSTERS, FILM_GENRES, FILM_DIRECTORS, SCREENWRITERS, FILM_DESCRIPTIONS, FILM_ACTORS, FILM_COUNTRIES, AGE_RATING, MIN_FILMS_YEAR, MAX_FILMS_YEAR, MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT, MIN_RATING_VALUE, MAX_RATING_VALUE} from "../const.js";

const generateFilmDuration = () => {
  const hours = getRandomInteger(FilmsDuration.HOUR_MIN, FilmsDuration.HOUR_MAX);
  const minutes = getRandomInteger(FilmsDuration.MINUTES_MIN, FilmsDuration.MINUTES_MAX);
  const filmDuration = `${hours}h ${minutes}m`;

  return filmDuration;
};

const generateDate = () => {
  const currentDate = new Date();
  const year = getRandomInteger(MIN_FILMS_YEAR, MAX_FILMS_YEAR);
  currentDate.setFullYear(year);

  return new Date(currentDate);
};

const generateComments = () => {

  const comments = [];
  const randomCommentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

  for (let i = 0; i < randomCommentsCount; i++) {
    const comment = {
      emoji: getRandomItem(COMMENT_EMOJIS),
      text: getRandomItem(COMMENT_TEXT),
      author: getRandomItem(COMMENT_USERS),
      day: generateDate()
    };
    comments.push(comment);
  }

  return comments;
};

export const createfilmCard = () => {
  const filmsTitle = getRandomItem(FILM_TITLES);

  return {
    title: filmsTitle,
    origianlTitle: filmsTitle,
    rating: getRandomFractionInteger(MIN_RATING_VALUE, MAX_RATING_VALUE),
    filmDirector: getRandomItem(FILM_DIRECTORS),
    screenwriters: getRandomItems(SCREENWRITERS),
    actors: getRandomItems(FILM_ACTORS),
    releaseDate: generateDate(),
    duration: generateFilmDuration(),
    country: getRandomItem(FILM_COUNTRIES),
    genres: getRandomArray(FILM_GENRES),
    poster: getRandomItem(FILM_POSTERS),
    description: getRandomItem(FILM_DESCRIPTIONS),
    comments: generateComments(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isToWatchList: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    age: getRandomItem(AGE_RATING)
  };
};
