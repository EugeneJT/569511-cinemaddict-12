import AbstractView from './abstract.js';
import {FilterType, MenuItem, ACTIVECLASS} from '../const.js';

const createMainNav = (filters, currentMenuItem, isDisable) => {
  const [watchlist, history, favorite] = filters.map((filter) => filter.count);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${currentMenuItem === FilterType.ALL ? ACTIVECLASS : ``}" data-item="${MenuItem.FILTER}" ${isDisable ? `disabled` : ``}>All movies</a>
      <a href="#watchlist" class="main-navigation__item ${currentMenuItem === FilterType.WATCHLIST ? ACTIVECLASS : ``}" data-item="${MenuItem.FILTER}" ${isDisable ? `disabled` : ``}>Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" class="main-navigation__item ${currentMenuItem === FilterType.HISTORY ? ACTIVECLASS : ``}" data-item="${MenuItem.FILTER}" ${isDisable ? `disabled` : ``}>History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${currentMenuItem === FilterType.FAVORITES ? ACTIVECLASS : ``}" data-item="${MenuItem.FILTER}" ${isDisable ? `disabled` : ``}>Favorites <span class="main-navigation__item-count">${favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuItem === FilterType.STATS ? ACTIVECLASS : ``}" data-item="${MenuItem.STATISTICS}" ${isDisable ? `disabled` : ``}>Stats</a>
  </nav>`
  );
};

export default class MainNav extends AbstractView {
  constructor(filters, currentMenuItem, isDisable) {
    super();
    this._filters = filters;
    this._isDisable = isDisable;
    this._currentMenuItem = currentMenuItem;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {

    return createMainNav(this._filters, this._currentMenuItem, this._isDisable);
  }


  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.getAttribute(`href`).split(`#`)[1]);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((item) => item.addEventListener(`click`, this._filterTypeChangeHandler));
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.item);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
