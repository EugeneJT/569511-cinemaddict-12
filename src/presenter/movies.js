import FilmPresenter, {State as FilmPresenterStates} from './film.js';
import SortView from '../view/sort.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsListSectionView from '../view/films-list-section';
import FilmListTitleView from '../view/films-list-title.js';
import FilmsContainerView from '../view/films-container.js';
import LoadingView from '../view/loading.js';
import NoMoviesView from '../view/no-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {filter} from '../utils/filter.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByComments} from '../utils/films.js';
import {SortType, UpdateType, UserAction, FilterType, FILMS_COUNT_PER_STEP, COUNT_EXTRA_FILMS, FilmsType} from '../const.js';

const DEFAULT_FILM_LIST_CLASS = `films-list`;
const EXTRA_FILMS_LIST_CLASS = `films-list--extra`;


export default class Movies {
  constructor(movieListContainer, moviesModel, filterModel, api) {
    this._movieListContainer = movieListContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;
    this._sortComponent = null;
    this._showMoreButton = null;
    this._siteNoData = new NoMoviesView();
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = new Map();
    this._isLoading = true;
    this._loadingComponent = new LoadingView();
    this._filmContainers = [];
    this._renderedFilms = FILMS_COUNT_PER_STEP;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._filmContainer = new FilmsSectionView();
    this._siteDefaultFilmsList = new FilmsListSectionView(DEFAULT_FILM_LIST_CLASS);
    this._siteExtraFilmsLists = new Array(COUNT_EXTRA_FILMS).fill().map(() => new FilmsListSectionView(EXTRA_FILMS_LIST_CLASS));

    render(this._movieListContainer, this._filmContainer);
    render(this._filmContainer, this._siteDefaultFilmsList);

    this._siteExtraFilmsLists.forEach((element) => {
      render(this._filmContainer, element);
    });

    this._renderMovies();

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearMovieList({resetRenderedFilms: true, resetSortType: true, isPopupOppened: false});

    remove(this._filmContainer);
    this._filmContainers.length = 0;
    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilterType();
    const films = [...this._moviesModel.getMovies()];
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsByRating);
    }

    return filtredFilms;
  }

  _handleViewAction(actionType, updateType, update, targetComment) {
    let film = null;
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((movie) => {
          film = movie;
          return this._api.getComments(movie.id);
        })
        .then((comments) => {
          film.comments = comments;
          this._moviesModel.updateMovie(updateType, film);
        });
        break;
      case UserAction.ADD_COMMENT:
        film = update;
        for (let presenter of this._filmPresenter.keys()) {
          if (presenter[0] === film.id) {
            this._filmPresenter.get(presenter).setViewState(FilmPresenterStates.SAVING);
          }
        }
        const commentsPromise = this._api.addComment(update, update.comments).then((comments) => {
          this._moviesModel.addComment(updateType, film);
          for (let presenter of this._filmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._filmPresenter.get(presenter).init(film);
            }
          }
          return Promise.resolve(comments);
        })
        .catch(()=>{
          for (let presenter of this._filmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._filmPresenter.get(presenter).setViewState(FilmPresenterStates.ABORTING);
            }
          }
        });
        return commentsPromise;
      case UserAction.DELETE_COMMENT:
        film = update;
        for (let presenter of this._filmPresenter.keys()) {
          if (presenter[0] === film.id) {
            this._filmPresenter.get(presenter).setViewState(FilmPresenterStates.DELETING, targetComment);
          }
        }
        const promiseOfDeleting = this._api.deleteComment(targetComment).then(() => {
          this._moviesModel.deleteComment(updateType, update);
          for (let presenter of this._filmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._filmPresenter.get(presenter).init(film);
            }
          }
          return Promise.resolve();
        })
        .catch(()=>{
          for (let presenter of this._filmPresenter.keys()) {
            if (presenter[0] === film.id) {
              this._filmPresenter.get(presenter).setViewState(FilmPresenterStates.ABORTING);
            }
          }
        });
        return promiseOfDeleting;
    }
    return null;
  }

  _handleModelEvent(updateType, updatedFilm) {
    const arrayOfPresenters = [];
    for (let presenter of this._filmPresenter.keys()) {
      if (presenter[0] === updatedFilm.id) {
        arrayOfPresenters.push(presenter);
      }
    }

    switch (updateType) {
      case UpdateType.PATCH:
        arrayOfPresenters.forEach(function (presenter) {
          this._filmPresenter.get(presenter).init(updatedFilm);
        }, this);
        break;
      case UpdateType.MINOR:
        this._clearMovieList({isPopupOppened: true});
        this._renderMovies();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetRenderedFilms: true, resetSortType: true, isPopupOppened: true});
        this._renderMovies();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMovies();
        break;
    }
  }

  _handleModeChange() {

    for (let presenter of this._filmPresenter.values()) {
      presenter.resetView();
    }

  }

  _renderNoData() {
    render(this._movieListContainer, this._siteNoData);
  }

  _renderFilmCard(filmContainer, film, i = 0) {
    const filmPresenter = new FilmPresenter(filmContainer, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set([film.id, i], filmPresenter);
  }

  _renderLoading() {
    render(this._movieListContainer, this._loadingComponent);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilmCard(this._filmsContainer, film));
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getMovies().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilms + FILMS_COUNT_PER_STEP);
    this._renderFilms(this._getMovies().slice(this._renderedFilms, newRenderedFilmsCount));
    this._renderedFilms = newRenderedFilmsCount;

    if (this._renderedFilms >= this._getMovies().length) {
      this._showMoreButton.getElement().remove();
    }
  }

  _renderShowMoreButton() {

    if (this._showMoreButton !== null) {
      this._showMoreButton = null;
    }

    this._showMoreButton = new ShowMoreButtonView();
    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);

    render(this._siteDefaultFilmsList, this._showMoreButton);
  }

  _renderExtraFilmsLists(elementContainer, i) {
    const containerId = i + 1;
    const sortedFilms = [...this._moviesModel.getMovies()].sort(this._extraFilmsListSortsTypes[i]).slice(0, 2);

    sortedFilms.forEach((film) => this._renderFilmCard(elementContainer, film, containerId), this);
  }

  _renderExtraFilmsContainers() {
    const newExtraFilmsLists = [];

    this._siteExtraFilmsLists.forEach((element, i) => {
      render(element, new FilmListTitleView(FilmsType[i]));
      const elementFilmContainer = new FilmsContainerView();
      this._filmContainers.push(elementFilmContainer);
      render(element, elementFilmContainer);
      newExtraFilmsLists.push(elementFilmContainer);
    });

    this._siteExtraFilmsLists = newExtraFilmsLists;

    this._siteExtraFilmsLists.forEach((element, i) => {
      this._renderExtraFilmsLists(element, i);
    }, this);
  }

  _renderFilmList() {
    const films = this._getMovies();
    for (let i = 0; i < Math.min(this._getMovies().length, this._renderedFilms); i++) {
      this._renderFilmCard(this._filmsContainer, films[i]);
    }

    if (this._getMovies().length > this._renderedFilms) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmContainers() {
    this._filmsContainer = new FilmsContainerView();
    this._filmContainers.push(this._filmsContainer);
    render(this._siteDefaultFilmsList, this._filmsContainer);
    this._renderFilmList();
  }

  _handleSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList();
    this._renderMovies();
  }

  _clearMovieList({resetSortType = false, resetRenderedFilms = false, isPopupOppened = false} = {}) {
    const filmsCount = this._moviesModel.getMovies().length;

    for (let presenter of this._filmPresenter.values()) {
      presenter.destroy(isPopupOppened);
    }

    this._filmPresenter = new Map();
    remove(this._sortComponent);
    remove(this._showMoreButton);
    remove(this._loadingComponent);
    remove(this._siteNoData);

    if (resetRenderedFilms) {
      this._renderedFilms = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilms = Math.min(filmsCount, this._renderedFilms);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderSiteSort() {

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovies() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._filterModel.getFilterType() === FilterType.STATS) {
      return;
    }

    if (!this._moviesModel.getMovies().length) {
      this._renderNoData();
      return;
    }

    this._renderSiteSort();
    this._extraFilmsListSortsTypes = [sortFilmsByRating, sortFilmsByComments];

    if (!this._filmContainers.length) {
      this._renderFilmContainers();
      this._renderExtraFilmsContainers();
    } else {
      this._renderFilmList();
      this._siteExtraFilmsLists.forEach((element, i) => {
        this._renderExtraFilmsLists(element, i);
      }, this);
    }
  }
}
