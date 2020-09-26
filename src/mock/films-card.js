import {getRandomInteger, getRandomFractionInteger, getRandomItem, getRandomItems, getRandomArray, generateID} from "../utils/common.js";
import {FilmsDuration, COMMENT_EMOJIS, COMMENT_USERS, COMMENT_TEXT, FILM_TITLES, FILM_POSTERS, FILM_GENRES, FILM_DIRECTORS, SCREENWRITERS, FILM_DESCRIPTIONS, FILM_ACTORS, FILM_COUNTRIES, AGE_RATING, MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT, MIN_RATING_VALUE, MAX_RATING_VALUE} from "../const.js";


const generateDate = (maxYearGap = 0) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentHours = currentDate.getHours();

  // Count previous year or remain current
  // Change year in currentDate object
  // Create variable with changed year
  const yearGap = getRandomInteger(-maxYearGap, 0);
  currentDate.setFullYear(currentDate.getFullYear() + yearGap);
  const year = currentDate.getFullYear();

  // If current year equal now year, count any previous month within this year
  // Change month in currentDate object
  const month = (currentYear === year) ? getRandomInteger(0, currentDate.getMonth()) : getRandomInteger(0, 11);
  currentDate.setMonth(month);

  let day;
  if (currentYear === year && month === currentMonth) { // this year and this month
    day = getRandomInteger(0, currentDate.getDate());
  } else {
    const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    day = getRandomInteger(0, daysInMonths[month]);
  }
  currentDate.setDate(day); // Change day in currentDate object

  const hours = (currentYear === year && month === currentMonth && day === currentDay)
    ? getRandomInteger(0, currentDate.getHours())
    : getRandomInteger(0, 24);

  currentDate.setHours(hours); // Change hours in currentDate object

  const minutes = (currentYear === year && month === currentMonth && day === currentDay && hours === currentHours)
    ? getRandomInteger(0, currentDate.getMinutes())
    : getRandomInteger(0, 60);

  currentDate.setMinutes(minutes);

  return new Date(currentDate);
};

export const generateComments = () => {

  const comments = [];
  const randomCommentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

  for (let i = 0; i < randomCommentsCount; i++) {
    const comment = {
      id: generateID(),
      emoji: getRandomItem(COMMENT_EMOJIS),
      text: getRandomItem(COMMENT_TEXT),
      author: getRandomItem(COMMENT_USERS),
      day: generateDate()
    };
    comments.push(comment);
  }

  return comments;
};

export const createfilmCard = (id) => {
  const filmsTitle = getRandomItem(FILM_TITLES);

  return {
    id,
    title: filmsTitle,
    origianlTitle: filmsTitle,
    rating: getRandomFractionInteger(MIN_RATING_VALUE, MAX_RATING_VALUE),
    filmDirector: getRandomItem(FILM_DIRECTORS),
    screenwriters: getRandomItems(SCREENWRITERS),
    actors: getRandomItems(FILM_ACTORS),
    releaseDate: generateDate(70),
    duration: getRandomInteger(FilmsDuration.MINUTES_MIN, FilmsDuration.MINUTES_MAX),
    country: getRandomItem(FILM_COUNTRIES),
    genres: getRandomArray(FILM_GENRES),
    poster: getRandomItem(FILM_POSTERS),
    description: getRandomItem(FILM_DESCRIPTIONS),
    comments: generateComments(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isToWatchList: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    age: getRandomItem(AGE_RATING),
    watchingDate: generateDate()
  };
};
