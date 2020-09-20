import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(films) {
    this._comments = films.slice().reduce((comments, film) => {
      comments[film.id] = film.comments;
      return comments;
    }, {});
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, newComment, filmID) {
    this._comments[filmID] = [...this._comments[filmID], newComment];
    this._notify(updateType, newComment, filmID);
  }

  deleteComment(updateType, deletedComment, filmID) {
    const index = this._comments[filmID].findIndex((comment) => comment.id === deletedComment.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[filmID] = [...this._comments[filmID].slice(0, index), ...this._comments[filmID].slice(index + 1)];
    this._notify(updateType, deletedComment, filmID);
  }
}
