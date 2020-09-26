import FilmView from "../view/films-card.js";
import PopupView from "../view/films-popup.js";
import {render, remove, replace} from "../utils/render.js";
import {KeyCode, Mode, UserAction, UpdateType} from "../const.js";

const {UPDATE, ADD, DELETE} = UserAction;
const {PATCH, MINOR} = UpdateType;

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(filmContainer, changeFilm, changeMode) {
    this._filmContainer = filmContainer;
    this._popupContainer = body;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popUpComponent = null;

    this._mode = Mode.DEFAULT;


    this._handlerShortcutKeysDown = this._handlerShortcutKeysDown.bind(this);
    this._handlerFilmPopupClick = this._handlerFilmPopupClick.bind(this);
    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._handlerWatchedClick = this._handlerWatchedClick.bind(this);
    this._handlerWatchListClick = this._handlerWatchListClick.bind(this);
    this._handlerCloseButtonClick = this._handlerCloseButtonClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._emoji = null;
    this._newComment = null;
    this._isPopUpReOpened = false;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopUpComponent = this._popUpComponent;

    this._filmCardComponent = new FilmView(film);
    this._popUpComponent = new PopupView(film, this._emoji, this._newComment, this._handlerPopUpCommentsRender);
    this._popUpComponent.setSubmitCommentHandler(this._handlerShortcutKeysDown);


    this._filmCardComponent.setFilmPopupClickHandler(this._handlerFilmPopupClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._filmCardComponent.setWatchedClickHandler(this._handlerWatchedClick);
    this._filmCardComponent.setWatchListClickHandler(this._handlerWatchListClick);

    this._popUpComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._popUpComponent.setWatchedClickHandler(this._handlerWatchedClick);
    this._popUpComponent.setWatchListClickHandler(this._handlerWatchListClick);
    this._popUpComponent.setCloseClickHandler(this._handlerCloseButtonClick);
    this._popUpComponent.setCommentDeleteHandler(this._handleCommentDeleteClick);


    if (prevFilmCardComponent === null || prevPopUpComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT || this._mode === Mode.POPUP) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popUpComponent, prevPopUpComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopUpComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popUpComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopUp();
    }
  }

  _handlerFavoriteClick() {
    this._changeFilm(UPDATE, PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handlerWatchedClick() {
    this._changeFilm(UPDATE, PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched,
              watchingDate: new Date()
            }
        )
    );
  }

  _handlerWatchListClick() {
    this._changeFilm(UPDATE, PATCH,
        Object.assign(
            {},
            this._film,
            {
              isToWatchList: !this._film.isToWatchList
            }
        )
    );
  }

  _openPopUp() {
    render(this._popupContainer, this._popUpComponent);
    if (this._isPopUpReOpened) {
      this._popUpComponent.restoreHandlers();
    }
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopUp() {
    this._isPopUpReOpened = true;
    this._popUpComponent.reset(this._film);
    remove(this._popUpComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handlerModelCommentsUpdate(updateType, updatedComment, filmID) {
    if (this._film.id === filmID) {
      switch (updateType) {
        case ADD:
          this._film.comments = Array.from(new Set([...this._film.comments, updatedComment]));
          break;
        case DELETE:
          this._film.comments = this._film.comments.filter((comment) => comment.id !== updatedComment.id);
          break;
      }
      this._changeFilm(UPDATE, PATCH, this._film);
    }
  }

  _handlerPopUpCommentsRender() {
    // this._changeFilm(DELETE, PATCH, newComment, this._film.id);
  }

  _handleCommentDeleteClick(element) {
    const commentId = element.dataset.commentId;
    const comments = this._film.comments.slice();
    comments.splice(comments.findIndex((comment) => String(comment.id) === commentId), 1);

    this._changeFilm(
        UPDATE,
        PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments,
            }
        )
    );
  }

  _handlerShortcutKeysDown(newComment) {
    this._changeFilm(ADD, PATCH, newComment, this._film.id);
  }

  _handlerControlsChange(film) {
    this._changeFilm(UPDATE, MINOR, film);
  }

  _handlerToggleChange(film) {
    this._changeFilm(UPDATE, PATCH, film);
  }

  _handlerFilmPopupClick() {
    this._openPopUp();
  }

  _handlerCloseButtonClick() {
    this._closePopUp();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC;

    if (isEscKey) {
      evt.preventDefault();
      this._closePopUp();
    }
  }
}
