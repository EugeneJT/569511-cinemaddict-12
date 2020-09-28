import MoviesModel from "./model/movies.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({
      url: `movies`
    })
      .then(Api.toJSON)
      .then((movies) => movies.map(MoviesModel.adaptToClient));
  }

  getComments(filmId) {
    return this._load({
      url: `comments/${filmId}`
    })
      .then(Api.toJSON)
      .then((comments) => comments.map(MoviesModel.adaptCommentsToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(film)),
      headers: new Headers({
        "Content-Type": `application/json`
      })
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  addComment(film, comments) {
    let lastComment = comments[comments.length - 1];
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(MoviesModel.adaptCommentToServer(lastComment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then((comment) =>{
      comments = comment.comments;
      let adaptedComments = comments.map(MoviesModel.adaptCommentsToClient);
      return Promise.resolve(adaptedComments);
    });
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`, {
          method,
          body,
          headers
        }
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
