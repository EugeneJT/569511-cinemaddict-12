import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();

    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies;
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateFilms(updateType, update) {
    const index = this._movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    const index = this._movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._movies.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({},
        film, {
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
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const commentsId = film.comments.map((comment) => comment.id);
    const adaptedFilm = Object.assign({},
        film, {
          "comments": commentsId,
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
              "date": film.releaseDate,
              "release_country": film.country
            },
            "runtime": film.duration,
            "genre": film.genres,
            "description": film.description
          },
          "user_details": {
            "watchlist": film.isToWatchList,
            "already_watched": film.isWatched,
            "watching_date": film.watchingDate,
            "favorite": film.isFavorite,
          }
        }
    );

    delete adaptedFilm.userEmoji;
    delete adaptedFilm.name;
    delete adaptedFilm.secondName;
    delete adaptedFilm.img;
    delete adaptedFilm.description;
    delete adaptedFilm.quantityOfComments;
    delete adaptedFilm.rating;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.director;
    delete adaptedFilm.writters;
    delete adaptedFilm.actors;
    delete adaptedFilm.ageLimit;
    delete adaptedFilm.filmDuration;
    delete adaptedFilm.filmGenre;
    delete adaptedFilm.country;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;
    return adaptedFilm;
  }

  static adaptCommentsToClient(comment) {
    const adaptedComment = Object.assign({}, comment, {
      name: comment.author,
      text: comment.comment,
      date: new Date(comment.date),
      emoji: comment.emotion
    });

    delete adaptedComment.author;
    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign({}, comment, {
      author: comment.name,
      comment: comment.text,
      date: comment.date,
      emotion: comment.emoji,
    });

    delete adaptedComment.id;
    delete adaptedComment.img;
    delete adaptedComment.name;
    delete adaptedComment.text;
    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
