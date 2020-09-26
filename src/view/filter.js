import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  // Cards amount shows for filters except "all" filter name
  // Not more than 5 cards
  const number = (type !== `all`)
    ? `<span class="main-navigation__item-count">${count}</span>`
    : ``;

  // Active style for filter
  const activeFilterClassName = (type === currentFilterType)
    ? `main-navigation__item--active`
    : ``;

  return (`
    <a href="#${type}" data-filter-type="${type}" class="main-navigation__item ${activeFilterClassName}">${name} ${number}</a>
  `);
};

const createNavigationMarkup = (filters, currentFilterType) => {
  // Generate filters
  // First array element (filter) has active class forever
  const filterItemsTemplate = filters.map((element) => createFilterItemTemplate(element, currentFilterType)).join(``);

  // Active style for stats
  const activeFilterClassName = (currentFilterType === `stats`)
    ? `main-navigation__item--active`
    : ``;

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" data-filter-type="stats" class="main-navigation__additional ${activeFilterClassName}">Stats</a>
    </nav>`
  );
};


export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

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
