import MoviesModel from "./model/movies.js";


const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._comments = {};
  }

  getMovies() {
    return this._load({url: `movies`})
    .then(Api.toJSON)
    .then((films) => films.map(MoviesModel.adaptToClient));
  }

  _getComments(filmCardId) {
    return this._load({url: `comments/${filmCardId}`})
    .then(Api.toJSON)
    .then((commentsArray) => MoviesModel.adaptCommentsToClient(commentsArray));
  }


  pullComments(films) {
    const promises = [];

    films.forEach((film) => {
      promises.push(this._getComments(film.id)
          .then((comments) => {
            film.comments = comments;
            this._comments[film.id] = comments;

            return film;
          }));
    });

    return Promise.all(promises);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {

    headers.append(`Authorization`, this._authorization);
    return fetch(
        `${this._endPoint}/${url}`,
        {
          method,
          body,
          headers
        }
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  updateMovies(film, fallback) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then(MoviesModel.adaptToClient)
    .then((adaptedFilm) => {

      const oldComments = this._comments[film.id].slice();

      const flags = film.comments.map((newComment) =>
        oldComments.findIndex((oldComment) => oldComment.id === newComment.id)
      );
      // If new comments don`t exist
      // We don't ask sever for
      if (flags.indexOf(false) === -1) {
        return (
          this._getComments(adaptedFilm.id)
            .then((comments) => {
              adaptedFilm.comments = comments;
              return Promise.resolve(adaptedFilm);
            })
        );
      } else {
        return (
          Promise.resolve(oldComments)
            .then((comments) => {
              adaptedFilm.comments = comments;
              return Promise.resolve(adaptedFilm);
            })
        );
      }


    })
    .catch((err) => {
      window.console.error(err);
      return Promise.resolve(fallback);
    });
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    // Почему && а не || (или) ????
    if (response.status < SuccessHTTPStatusRange.MIN
      && response.status > SuccessHTTPStatusRange.MAX) {

      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static catchError(err) {
    throw err;
  }
}
