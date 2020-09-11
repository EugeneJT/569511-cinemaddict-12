import AbstractView from "./abstract.js";

const createFilmsCardTemplate = (filmCard) => {
  const {poster, age, title, rating, duration, description, genre, comments} = filmCard;

  const commentsCount = comments.length;

  return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${age}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist film-card__controls-item--active">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`;
};

export default class Film extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._filmDetailsClickHandler = this._filmDetailsClickHandler.bind(this);
    this._controlsClickHandler = this._controlsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmsCardTemplate(this._filmCard);
  }

  _filmDetailsClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
      this._callback.filmDetailsClick();
    }
  }

  _controlsClickHandler(evt) {
    evt.preventDefault();
    switch (true) {
      case evt.target.classList.contains(`film-card__controls-item--add-to-watchlist`):
        this._callback.controlsClick(Object.assign({}, this._filmCard, {isWatch: !this._filmCard.isWatch}));
        break;
      case evt.target.classList.contains(`film-card__controls-item--mark-as-watched`):
        this._callback.controlsClick(Object.assign({}, this._filmCard, {isHistory: !this._filmCard.isHistory}));
        break;
      case evt.target.classList.contains(`film-card__controls-item--favorite`):
        this._callback.controlsClick(Object.assign({}, this._filmCard, {isFavorites: !this._filmCard.isFavorites}));
        break;
    }
  }

  setControlsClickHandler(callback) {
    this._callback.controlsClick = callback;
    this.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, this._controlsClickHandler);
  }

  setFilmDetailsClickHandler(callback) {
    this._callback.filmDetailsClick = callback;
    this.getElement().addEventListener(`click`, this._filmDetailsClickHandler);
  }
}
