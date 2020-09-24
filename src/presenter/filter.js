import FilterView from "../view/filter.js";
import {getFiltersCount} from "../utils/filter.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UpdateType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {MAJOR} = UpdateType;

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);

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

    return getFiltersCount(movies);
  }
}
