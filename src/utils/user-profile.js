export const getUserRank = (films, userProfileData) => {
  // Cards with watched flag
  const watchedFilmsAmount = films.filter((el) => el.isWatched).length;
  // User profile grade name by default
  let userGradeName = ``;

  if (watchedFilmsAmount > 0) {

    for (const grade in userProfileData) {
      if (userProfileData.hasOwnProperty(grade)) {
        const minFilms = userProfileData[grade].min;
        const maxFilms = userProfileData[grade].max;
        userGradeName = (watchedFilmsAmount >= minFilms && watchedFilmsAmount <= maxFilms) ? grade : false;

        if (userGradeName) {
          break; // If user name is find, break cycle
        }
      }
    }
  }

  return userGradeName;
};
