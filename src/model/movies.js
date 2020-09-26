import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setMovies(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._films.slice();
  }

  updateMovie(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [...this._films.slice(0, index), updatedFilm, ...this._films.slice(index + 1)];
    this._notify(updateType, updatedFilm);
  }

  addComment(updateType, comment, filmID) {

    const updatedFilm = this._films.find((film) => film.id === filmID);

    if (updatedFilm === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    updatedFilm.comments.push(comment);

    this._notify(updateType, updatedFilm);
  }

  deleteComment(updateType, deletedComment, filmID) {

    const updatedFilm = this._films.find((film) => film.id === filmID);

    if (updatedFilm === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    updatedFilm.comments = updatedFilm.comments.filter((comment) => comment.id !== deletedComment.id).slice();

    this._notify(updateType, updatedFilm);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          poster: film.film_info.poster,
          title: film.film_info.title,
          rating: film.film_info.total_rating,
          releaseDate:
            (film.film_info.release.date)
              ? new Date(film.film_info.release.date)
              : film.film_info.release.date,
          duration: film.film_info.runtime,
          description: film.film_info.description,
          originalTitle: film.film_info.title,
          screenwriters: film.film_info.writers,
          actors: film.film_info.actors,
          country: film.film_info.release.release_country,
          filmDirector: film.film_info.director,
          genres: film.film_info.genre,
          age: film.film_info.age_rating,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          isToWatchList: film.user_details.watchlist,
          watchingDate:
            (film.user_details.watching_date)
              ? new Date(film.user_details.watching_date)
              : film.watching_date,
        }
    );

    // Remove unused keys
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptCommentsToClient(commentsArray) {
    return commentsArray.map((commentObject) => {
      const adaptedComment = Object.assign(
          {},
          commentObject,
          {
            text: commentObject.comment,
            emoji: commentObject.emotion,
            date:
              (commentObject.date)
                ? new Date(commentObject.date)
                : commentObject.date
          }
      );

      delete adaptedComment.comment;
      delete adaptedComment.emotion;

      return adaptedComment;
    });
  }

  static adaptFilmToServer(film) {
    const comments =
      (film.comments.length >= 1)
        ? film.comments.map((obj) => obj.id)
        : film.comments;

    const releaseDate =
    (film.release)
      ? new Date(film.release)
      : film.release;

    const watchingDate =
    (film.watchingDate)
      ? new Date(film.watchingDate)
      : film.watchingDate;

    return Object.assign(
        {},
        {
          "id": film.id,
          comments,
          "film_info": {
            "title": film.title,
            "alternative_title": film.originalTitle,
            "total_rating": film.rating,
            "poster": film.poster,
            "age_rating": film.age,
            "director": film.filmDirector,
            "writers": film.screenwriters,
            "actors": film.actors,
            "release": {
              "date": releaseDate,
              "release_country": film.country
            },
            "runtime": film.duration,
            "genre": film.genres,
            "description": film.description
          },
          "user_details": {
            "watchlist": film.isToWatchList,
            "already_watched": film.isWatched,
            "watching_date": watchingDate,
            "favorite": film.isFavorite,
          }
        });
  }
}
