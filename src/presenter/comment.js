import CommentView from "../view/comment.js";
import {render, remove} from "../utils/render.js";
import {UserAction} from "../const.js";

const {DELETE} = UserAction;

export default class Comment {
  constructor(commentsContainer, filmID, changeComment) {
    this._commentsContainer = commentsContainer;
    this._filmID = filmID;
    this._changeComment = changeComment;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentView(this._comment);
    this._commentComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._commentsContainer, this._commentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleDeleteClick(comment) {
    this._changeComment(DELETE, DELETE, comment, this._filmID);
    this.destroy();
  }
}
