import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsContainerView from "../view/films-container.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import LoadingView from '../view/loading.js';
import ExtraFilmTemplateView from "../view/extra-film.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortTopRated, sortMostComments, sortByDate} from "../utils/common.js";
import {filter} from "../utils/filter.js";
import {FILMS_COUNT_PER_STEP, COUNT_TOP_RATED_FILMS, COUNT_MOST_COMMENTED_FILMS, FilmsType, SortType, UserAction, UpdateType} from "../const.js";
import FilmCard, {State as FilmPresenterStates} from "./film.js";


const {UPDATE, ADD, DELETE} = UserAction;
const {PATCH, MINOR, MAJOR} = UpdateType;
const {ALL, RATED, COMMENTED} = FilmsType;


export default class Movies {
  constructor(moviesContainer, moviesModel, filterModel, api) {
    this._moviesContainer = moviesContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._moviesContainerElement = this._moviesContainer.getElement();
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._allFilmPresenter = {};
    this._topRatedFilmPresenter = {};
    this._mostCommentedFilmPresenter = {};
    this._api = api;

    this._isLoading = true;
    this.destroyed = false;

    this._sortingComponent = null;
    this._loadMoreButtonComponent = null;

    this._sortComponent = new SortView();
    this._filmsListContainerComponent = new FilmsContainerView();
    this._filmsTopRatedContainerComponent = new ExtraFilmTemplateView(`Top rated`);
    this._filmsMostCommentedContainerComponent = new ExtraFilmTemplateView(`Most commented`);
    this._filmsListComponent = new FilmsListView();
    this._noFilmComponent = new NoFilmView();
    this._extraFilmComponent = new ExtraFilmTemplateView();
    this._loadingComponent = new LoadingView();

    this._handlerViewAction = this._handlerViewAction.bind(this);
    this._handlerModelEvent = this._handlerModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
    this._handleShowButtonClick = this._handleShowButtonClick.bind(this);
  }

  init() {
    this.destroyed = false;

    this._moviesModel.addObserver(this._handlerModelEvent);
    this._filterModel.addObserver(this._handlerModelEvent);

    render(this._moviesContainerElement, this._filmsListComponent);
    this._renderContent();
  }

  _getFilms() {
    let currentFilterType = this._filterModel.getFilter();
    currentFilterType = (currentFilterType === `stats`) ? `allmovies` : currentFilterType;

    const films = this._moviesModel.getMovies();
    const filteredFilms = filter[currentFilterType](films);

    switch (this._currentSortType) {
      case SortType.DATE_DOWN:
        return sortByDate(filteredFilms.slice());
      case SortType.RATING_DOWN:
        return sortTopRated(filteredFilms.slice());
      default:
        return filteredFilms;
    }

  }

  _renderLoading() {
    render(this._filmsListComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this._clearMovieList({resetRenderedFilmsCount: true, resetSortType: true});

    this._moviesModel.removeObserver(this._handlerModelEvent);
    this._filterModel.removeObserver(this._handlerModelEvent);
    this.destroyed = true;
  }

  _handlerModeChange() {
    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._topRatedFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._mostCommentedFilmPresenter).forEach((presenter) => presenter.resetView());
  }


  _handlerViewAction(actionType, updateType, update, targetComment) {
    let film = null;
    switch (actionType) {
      case UPDATE:
        this._api.updateFilm(update).then((movie) => {
          film = movie;
          return this._api.getComments(movie.id);
        })
        .then((comments) => {
          film.comments = comments;
          this._moviesModel.updateFilms(updateType, film);
        });
        break;
      case ADD:
        film = update;
        for (let presenter of this._allFilmPresenter.keys()) {
          if (presenter[0] === film.id) {
            this._allFilmPresenter.get(presenter).setViewState(FilmPresenterStates.SAVING);
          }
        }
        const commentsPromise = this._api.addComment(update, update.comments).then((comments) => {
          this._moviesModel.addComment(updateType, film);
          for (let presenter of this._allFilmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._allFilmPresenter.get(presenter).init(film);
            }
          }
          return Promise.resolve(comments);
        })
        .catch(()=>{
          for (let presenter of this._allFilmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._allFilmPresenter.get(presenter).setViewState(FilmPresenterStates.ABORTING);
            }
          }
        });
        return commentsPromise;
      case DELETE:
        film = update;
        for (let presenter of this._allFilmPresenter.keys()) {
          if (presenter[0] === film.id) {
            this._allFilmPresenter.get(presenter).setViewState(FilmPresenterStates.DELETING, targetComment);
          }
        }
        const promiseOfDeleting = this._api.deleteComment(targetComment).then(() => {
          this._moviesModel.deleteComment(updateType, update);
          for (let presenter of this._allFilmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._allFilmPresenter.get(presenter).init(film);
            }
          }
          return Promise.resolve();
        })
        .catch(()=>{
          for (let presenter of this._allFilmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._allFilmPresenter.get(presenter).setViewState(FilmPresenterStates.ABORTING);
            }
          }
        });
        return promiseOfDeleting;
    }
    return null;
  }

  _handlerModelEvent(updateType, updatedFilm) {
    if (updatedFilm === `stats`) {
      return;
    }

    switch (updateType) {
      case PATCH:
        if (this._allFilmPresenter[updatedFilm.id]) {
          this._allFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._topRatedFilmPresenter[updatedFilm.id]) {
          this._topRatedFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._mostCommentedFilmPresenter[updatedFilm.id]) {
          this._mostCommentedFilmPresenter[updatedFilm.id].init(updatedFilm);
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    render(this._moviesContainerElement, this._sortComponent, RenderPosition.BEFORE, this._filmsListComponent);
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList({resetAllMoviesOnly: true, resetRenderedFilmsCount: true});
    this._renderSorting();
    this._renderFilmList();

  }

  _renderFilmsItem(container, count, elem, type) {
    for (let i = 0; i < count; i++) {
      this._renderFilm(container, elem[i], type);
    }
  }

  _renderFilmCard(container, film, type) {
    const filmPresenter = new FilmCard(container, this._handlerViewAction, this._handlerModeChange);
    filmPresenter.init(film);
    switch (type) {
      case ALL:
        this._allFilmPresenter[film.id] = filmPresenter;
        break;
      case RATED:
        this._topRatedFilmPresenter[film.id] = filmPresenter;
        break;
      case COMMENTED:
        this._mostCommentedFilmPresenter[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilmList() {
    const films = this._getFilms();
    const filmsCount = films.length;
    const minStep = Math.min(filmsCount, this._renderedFilmCount);
    const allFilms = films.slice(0, minStep);

    this._renderFilmCards(this._filmsListContainerComponent, allFilms, ALL);

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

    render(this._moviesContainerElement, this._filmsTopRatedContainerComponent.getElement());
    render(this._moviesContainerElement, this._filmsMostCommentedContainerComponent.getElement());

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
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP);
    const addFilmsCount = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmsCount);


    this._renderFilmCards(this._filmsListContainerComponent, addFilmsCount, ALL);
    this._renderedFilmCount = newRenderedFilmsCount;

    if (this._renderedFilmCount >= filmsCount) {
      remove(this._showButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._showButtonComponent !== null) {
      this._showButtonComponent = null;
    }

    this._showButtonComponent = new LoadMoreButtonView();
    render(this._filmsListComponent, this._showButtonComponent);
    this._showButtonComponent.setShowButtonClickHandler(this._handleShowButtonClick);
  }

  _renderFilm(container, film, type) {
    const filmPresenter = new FilmCard(container, this._handlerViewAction, this._handlerModeChange);
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
    render(this._filmsListComponent, this._noFilmComponent);
  }

  _clearMovieList({resetAllMoviesOnly = false, resetRenderedFilmsCount = false, resetSortType = false} = {}) {

    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.destroy());
    this._allFilmPresenter = {};

    if (resetRenderedFilmsCount) {
      this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    }

    if (resetAllMoviesOnly) {
      return;
    }

    Object.values(this._topRatedFilmPresenter).forEach((presenter) => presenter.destroy());
    Object.values(this._mostCommentedFilmPresenter).forEach((presenter) => presenter.destroy());

    this._topRatedFilmPresenter = {};
    this._mostCommentedFilmPresenter = {};
    remove(this._sortingComponent);
    remove(this._showButtonComponent);
    remove(this._filmsTopRatedContainerComponent);
    remove(this._filmsMostCommentedContainerComponent);
    remove(this._sortComponent);
    remove(this._filmsListComponent);
    remove(this._loadingComponent);


    if (this._noFilmComponent) {
      remove(this._noFilmComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderContent() {
    const filmsCount = this._getFilms().length;

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
