import FilterView from "../view/filter.js";
import {filter} from "../utils/filter.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {FilterType, UpdateType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {MAJOR} = UpdateType;

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel, handleStatisticClick, handleMenuItemClick) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._handleStatisticClick = handleStatisticClick.bind(this);
    this._handleMenuItemClick = handleMenuItemClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);

    this._filterComponent.setStatisticClickHandler(this._handleStatisticClick);
    this._filterComponent.setMenuItemClickHandler(this._handleMenuItemClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](movies).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](movies).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](movies).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](movies).length
      },
    ];
  }
}
