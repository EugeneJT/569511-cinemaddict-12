import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";
const {ALL, WATCHLIST, HISTORY, FAVORITES} = FilterType;

const createNavigationMarkup = (filters, currentFilter) => {
  const {watchlist, history, favorites} = filters;
  const activeFilterClassName = (currentFilter === `stats`)
    ? `main-navigation__item--active`
    : ``;

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${currentFilter === ALL ? ` main-navigation__item--active` : ``}" data-filter-type="${ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${currentFilter === WATCHLIST ? ` main-navigation__item--active` : ``}" data-filter-type="${WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" class="main-navigation__item ${currentFilter === HISTORY ? ` main-navigation__item--active` : ``}" data-filter-type="${HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${currentFilter === FAVORITES ? ` main-navigation__item--active` : ``}" data-filter-type="${FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" data-filter-type="stats" class="main-navigation__additional ${activeFilterClassName}">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationMarkup(this._filters, this._currentFilter);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    if (evt.target.dataset.filterType !== `stats`) {
      this._callback.menuItemClick();
      this._callback.filterChange(evt.target.dataset.filterType);
    } else {
      this._callback.filterChange(evt.target.dataset.filterType);
      this._callback.statisticClick();
    }
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener(`click`, this._filterChangeHandler);
  }

  setStatisticClickHandler(callback) {
    this._callback.statisticClick = callback;
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuItemClick = callback;
  }
}
