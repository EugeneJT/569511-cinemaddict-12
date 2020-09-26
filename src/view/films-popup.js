import SmartView from "./smart.js";
import {createCommentsTemplate} from "./comment.js";
import {formatDurationFilmDate, formatFilmDate} from "../utils/film-card.js";
import {DateFormats, COMMENT_USERS} from "../const.js";
import {getRandomItem, generateID} from "../utils/common.js";


const createFilmsPupupTemplate = (data) => {
  const {poster, age, title, comments, origianlTitle, genres, rating, filmDirector, screenwriters, actors, releaseDate, duration, country, description, isFavorite, isToWatchList, isWatched, emoji, text} = data;

  const watchListClass = isToWatchList ? `checked` : ``;
  const isWatchedClass = isWatched ? `checked` : ``;
  const isFavoriteClass = isFavorite ? `checked` : ``;

  const commentsMarkup = createCommentsTemplate(comments, emoji, text);

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${origianlTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmDirector}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${screenwriters}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatFilmDate(releaseDate, DateFormats.DMY)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatDurationFilmDate(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                  <span class="film-details__genre">${genres}</span>
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" ${watchListClass} class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" ${isWatchedClass} class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" ${isFavoriteClass} class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          ${commentsMarkup}
        </div>
      </form>
    </section>`;
};

export default class Popup extends SmartView {
  constructor(filmCard, emoji, newComment, renderComments) {
    super();

    this._filmCard = filmCard;
    this._data = Object.assign({}, this._filmCard);
    this._data.emoji = ``;
    this._data.text = ``;

    this._comment = null;
    this._renderComments = renderComments;

    this._commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._shortcutKeysDownHandler = this._shortcutKeysDownHandler.bind(this);
    this._commentsInputHandler = this._commentsInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);


    this._setInnerHandlers();
    this._renderComments(this._commentsContainer);

  }

  reset() {
    this.updateData(this._filmCard);
  }

  getTemplate() {
    return createFilmsPupupTemplate(this._data);
  }

  restoreComments() {
    const newCommentsContainer = this.getElement().querySelector(`.film-details__comments-list`);
    this._renderComments(newCommentsContainer);
  }

  _createComment() {

    if (!this._data.emoji || !this._data.text) {
      throw new Error(`Can't create comment`);
    }

    return {
      id: generateID(),
      emoji: this._data.emoji,
      text: this._data.text,
      author: getRandomItem(COMMENT_USERS),
      day: new Date()
    };
  }

  _shortcutKeysDownHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) {
      evt.preventDefault();
      this._callback.submitComment(this._createComment());
    }
  }

  _commentsInputHandler(evt) {
    evt.preventDefault();
    this._data.text = evt.target.value;
  }

  _emojiToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({emoji: evt.target.value});
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiToggleHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentsInputHandler);
  }

  setSubmitCommentHandler(callback) {
    this._callback.submitComment = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._shortcutKeysDownHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchListClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setSubmitCommentHandler(this._callback.submitComment);
    this.setCommentDeleteHandler(this._callback.commentDeleteHandler);
  }

  static parseFilmToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.emoji;
    delete data.text;

    return data;
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.commentDeleteHandler(evt.target);
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDeleteHandler = callback;
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((button) => button.addEventListener(`click`, this._commentDeleteHandler));
  }

}
