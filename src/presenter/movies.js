import ProfileView from "../view/profile.js";
import SortView from "../view/sort.js";
import FilmView from "../view/films-card.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsContainerView from "../view/films-container.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import ExtraFilmTemplateView from "../view/extra-film.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortTopRated, sortMostComments, sortByDate} from "../utils/common.js";
import {FILMS_COUNT_PER_STEP, COUNT_TOP_RATED_FILMS, COUNT_MOST_COMMENTED_FILMS, FilmsType, SortType, UserAction, UpdateType} from "../const.js";
import FilmCard from "./film.js";
import {filterRules} from "../utils/filter.js";


const {UPDATE, ADD, DELETE} = UserAction;
const {PATCH, MINOR, MAJOR} = UpdateType;
const {ALL, RATED, COMMENTED} = FilmsType;


export default class Movies {
  constructor(moviesContainer, moviesModel, commentsModel, filterModel) {
    this._moviesContainer = moviesContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._moviesContainerElement = this._moviesContainer.getElement();
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._allFilmPresenter = {};
    this._topRatedFilmPresenter = {};
    this._mostCommentedFilmPresenter = {};

    this._sortingComponent = null;
    this._loadMoreButtonComponent = null;

    this._profileComponent = new ProfileView();
    this._sortComponent = new SortView();
    this._movieListComponent = new FilmView();
    this._filmsListContainerComponent = new FilmsContainerView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmComponent = new NoFilmView();
    this._extraFilmComponent = new ExtraFilmTemplateView();

    this._handlerViewAction = this._handlerViewAction.bind(this);
    this._handlerModelEvent = this._handlerModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
    this._handleShowButtonClick = this._handleShowButtonClick.bind(this);

    this._moviesModel.addObserver(this._handlerModelEvent);
    this._filterModel.addObserver(this._handlerModelEvent);
  }

  init() {
    render(this._moviesContainerElement, this._movieListComponent);
    this._renderContent();
  }

  _getFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = this._moviesModel.getMovies();
    const filteredFilms = films.filter((film) => filterRules[currentFilter](film));

    switch (this._currentSortType) {
      case SortType.DATE_DOWN:
        return sortByDate(filteredFilms.slice());
      case SortType.RATING_DOWN:
        return sortTopRated(filteredFilms.slice());
      default:
        return filteredFilms;
    }

  }

  _handlerModeChange() {
    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._topRatedFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._mostCommentedFilmPresenter).forEach((presenter) => presenter.resetView());
  }

  _handlerViewAction(actionType, updateType, updatedData, filmID) {
    switch (actionType) {
      case UPDATE:
        this._moviesModel.updateMovie(updateType, updatedData);
        break;
      case ADD:
        this._commentsModel.addComment(updateType, updatedData, filmID);
        break;
      case DELETE:
        this._commentsModel.deleteComment(updateType, updatedData, filmID);
        break;
    }
  }

  _handlerModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case PATCH:
        if (this._allFilmPresenter[updatedFilm.id]) {
          this._allFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._ratedFilmPresenter[updatedFilm.id]) {
          this._ratedFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._commentedFilmPresenter[updatedFilm.id]) {
          this._commentedFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        break;
      case MINOR:
        this._clearMovieList();
        this._renderContent();
        break;
      case MAJOR:
        this._clearMovieList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderContent();
        break;
    }
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
    render(this._movieListContainer, this._sortComponent, RenderPosition.BEFORE, this._movieListComponent);
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._setActiveSortElement(sortType);
    this._currentSortType = sortType;
    this._clearMovieList({resetAllMoviesOnly: true, resetRenderedFilmsCount: true});
    this._renderSorting();
    this._renderFilmList();

  }

  _setActiveSortElement(sortType) {
    const sortComponent = this._sortComponent.getElement();
    const oldSortElement = sortComponent.querySelector(`a[data-sort-type="${this._currentSortType}"]`);
    const newSortElement = sortComponent.querySelector(`a[data-sort-type="${sortType}"]`);
    oldSortElement.classList.remove(`sort__button--active`);
    newSortElement.classList.add(`sort__button--active`);
  }

  _clearFilmList() {
    this._filmsListContainerComponent.getElement().innerHTML = ``;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
  }

  _renderFilmsItem(container, count, elem, type) {
    for (let i = 0; i < count; i++) {
      this._renderFilm(container, elem[i], type);
    }
  }

  _renderFilmCard(container, film, type) {
    const filmPresenter = new FilmCard(container, this._handlerViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);
    switch (type) {
      case ALL:
        this._allFilmPresenter[film.id] = filmPresenter;
        break;
      case RATED:
        this._ratedFilmPresenter[film.id] = filmPresenter;
        break;
      case COMMENTED:
        this._commentedFilmPresenter[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilmList() {
    const films = this._getFilms();
    const filmsCount = films.length;
    const minStep = Math.min(filmsCount, this._renderedFilmCount);
    const allFilms = films.slice(0, minStep);

    this._renderFilmCards(this._filmsListContainerComponent, allFilms, ALL);

    this._renderFilmsItem(this._filmsListContainerComponent.getElement(), minStep, this._films, FilmsType.ALL);
    render(this._allMoviesComponent, this._filmsListContainerComponent);

    if (filmsCount > this._renderedFilmCount) {
      this._renderLoadMoreButton();
    }
  }


  _renderFilmCards(container, films, type) {
    films.forEach((film) => this._renderFilmCard(container, film, type));
  }


  _renderExtraFilms() {
    if (this._getFilms().length <= 1) {
      return;
    }
    const siteMainElement = document.querySelector(`.main`);

    render(this._moviesContainerElement, new ExtraFilmTemplateView(`Top rated`).getElement());
    render(this._moviesContainerElement, new ExtraFilmTemplateView(`Most commented`).getElement());

    const topRateArray = this._getFilms().slice();
    const topComments = this._getFilms().slice();

    sortTopRated(topRateArray);
    sortMostComments(topComments);

    const filmsListExtraContainer = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsTopRatedContainer = filmsListExtraContainer[0];
    const filmsMostCommentedContainer = filmsListExtraContainer[1];

    this._renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS, topRateArray, FilmsType.TOP_RATED);
    this._renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS, topComments, FilmsType.MOST_COMMENTED);
  }


  _handleShowButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const addFilmsCount = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);


    this._renderFilmCards(this._filmsListComponent, addFilmsCount, ALL);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._showButtonComponent !== null) {
      this._showButtonComponent = null;
    }

    this._showButtonComponent = new LoadMoreButtonView();
    render(this._allMoviesComponent, this._showButtonComponent);
    this._showButtonComponent.setShowButtonClickHandler(this._handleShowButtonClick);
  }

  _renderFilm(container, film, type) {
    const filmPresenter = new FilmCard(container, this._handlerFilmCardChange, this._handlerModeChange);
    filmPresenter.init(film);
    switch (type) {
      case FilmsType.ALL:
        this._allFilmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.TOP_RATED:
        this._topRatedFilmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.MOST_COMMENTED:
        this._mostCommentedFilmPresenter[film.id] = filmPresenter;
        break;
    }
  }

  _renderNoFilms() {
    render(this._filmsSectionComponent, this._noFilmComponent);
  }

  _clearMovieList({resetAllMoviesOnly = false, resetRenderedFilmsCount = false, resetSortType = false} = {}) {

    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.destroy());
    this._allFilmPresenter = {};

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    remove(this._sortingComponent);
    remove(this._showButtonComponent);

    if (resetAllMoviesOnly) {
      return;
    }

    Object.values(this._ratedFilmPresenter).forEach((presenter) => presenter.destroy());
    Object.values(this._commentedFilmPresenter).forEach((presenter) => presenter.destroy());

    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};

    remove(this._noMoviesComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderContent() {
    const filmsCount = this._getFilms().length;

    if (filmsCount <= 0) {
      this._renderNoFilms();
      return;
    }

    render(this._moviesContainerElement, this._filmsListComponent.getElement());
    render(this._filmsListComponent.getElement(), this._filmsListContainerComponent.getElement());

    this._renderSorting();
    this._renderFilmList();
    this._renderExtraFilms();
  }
}
