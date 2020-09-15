import FilmView from "../view/films-card.js";
import PopupView from "../view/films-popup.js";
import {render, remove, replace} from "../utils/render.js";
import {KeyCode, Mode} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(filmContainer, changeFilm, changeMode) {
    this._filmContainer = filmContainer;
    this._popUpContainer = body;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popUpComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlerFilmPopupClick = this._handlerFilmPopupClick.bind(this);
    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._handlerWatchedClick = this._handlerWatchedClick.bind(this);
    this._handlerWatchListClick = this._handlerWatchListClick.bind(this);
    this._handlerCloseButtonClick = this._handlerCloseButtonClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopUpComponent = this._popUpComponent;
    this._isPopUpReOpened = false;

    this._filmCardComponent = new FilmView(film);
    this._popUpComponent = new PopupView(film);

    this._filmCardComponent.setFilmPopupClickHandler(this._handlerFilmPopupClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._filmCardComponent.setWatchedClickHandler(this._handlerWatchedClick);
    this._filmCardComponent.setWatchListClickHandler(this._handlerWatchListClick);

    this._popUpComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._popUpComponent.setWatchedClickHandler(this._handlerWatchedClick);
    this._popUpComponent.setWatchListClickHandler(this._handlerWatchListClick);
    this._popUpComponent.setCloseClickHandler(this._handlerCloseButtonClick);

    if (prevFilmCardComponent === null || prevPopUpComponent === null) {
      render(this._filmContainer, this._filmCardComponent.getElement());
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
    this._changeFilm(
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
    this._changeFilm(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handlerWatchListClick() {
    this._changeFilm(
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
    render(this._popUpContainer, this._popUpComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopUp() {
    this._popUpContainer.removeChild(this._popUpComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handlerControlsChange(film) {
    this._changeFilm(film);
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
