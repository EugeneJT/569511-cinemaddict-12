import ProfileView from "../view/profile.js";
import SortView from "../view/sort.js";
import FilmView from "../view/films-card.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsContainerView from "../view/films-container.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import PopupView from "../view/films-popup.js";
import ExtraFilmTemplateView from "../view/extra-film.js";
import {render} from "../utils/render.js";
import {sortTopRated, sortMostComments} from "../utils/common.js";
import {FILMS_COUNT_PER_STEP, COUNT_TOP_RATED_FILMS, COUNT_MOST_COMMENTED_FILMS, KeyCode} from "../const.js";


export default class Movies {
  constructor(moviesContainer) {
    this._moviesContainer = moviesContainer;

    this._moviesContainerElement = this._moviesContainer.getElement();

    this._profileComponent = new ProfileView();
    this._sortComponent = new SortView();
    this._filmsListContainerComponent = new FilmsContainerView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmComponent = new NoFilmView();
    this._extraFilmComponent = new ExtraFilmTemplateView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._popupComponent = new PopupView();
  }

  init(films) {
    this._films = films;

    this._renderContent();
  }

  _renderFilmsItem(container, count, elem) {
    for (let i = 0; i < count; i++) {
      this._renderFilm(container, elem[i]);
    }
  }

  _renderContent() {

    if (this._films.length <= 0) {
      this._renderNoFilms();
    } else {

      render(this._moviesContainerElement, this._filmsListComponent.getElement());
      render(this._filmsListComponent.getElement(), this._filmsListContainerComponent.getElement());

      const minStep = Math.min(this._films.length, FILMS_COUNT_PER_STEP);

      this._renderFilmsItem(this._filmsListContainerComponent.getElement(), minStep, this._films);
      this._renderLoadMoreButton();
      this._renderExtraFilms();
    }
  }

  _renderExtraFilms() {

    if (this._films.length <= 1) {
      return;
    }
    const siteMainElement = document.querySelector(`.main`);

    render(this._moviesContainerElement, new ExtraFilmTemplateView(`Top rated`).getElement());
    render(this._moviesContainerElement, new ExtraFilmTemplateView(`Most commented`).getElement());

    const topRateArray = this._films.slice();
    const topComments = this._films.slice();

    sortTopRated(topRateArray);
    sortMostComments(topComments);

    const filmsListExtraContainer = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsTopRatedContainer = filmsListExtraContainer[0];
    const filmsMostCommentedContainer = filmsListExtraContainer[1];

    this._renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS, topRateArray);
    this._renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS, topComments);
  }

  _renderLoadMoreButton() {
    if (this._films.length > FILMS_COUNT_PER_STEP) {
      let renderedFilmCount = FILMS_COUNT_PER_STEP;

      this._loadMoreButtonComponent.setClickHandler(() => {
        this._films
          .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
          .forEach((film) => this._renderFilm(this._filmsListContainerComponent.getElement(), film));

        renderedFilmCount += FILMS_COUNT_PER_STEP;

        if (renderedFilmCount >= this._films.length) {
          this._loadMoreButtonComponent.getElement().remove();
          this._loadMoreButtonComponent.removeElement();
        }

      });

      render(this._filmsListComponent.getElement(), this._loadMoreButtonComponent.getElement());
    }
  }

  _renderFilm(filmListElement, film) {
    const filmComponentElement = new FilmView(film).getElement();
    let filmPopupComponent = null;

    const showPopup = () => {
      hidePopup();

      filmPopupComponent = new PopupView(film);

      filmPopupComponent.setEditClickHandler(() => {
        hidePopup();
      });

      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC;

        if (isEscKey) {
          evt.preventDefault();
          hidePopup();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      document.addEventListener(`keydown`, onEscKeyDown);

      document.body.appendChild(filmPopupComponent.getElement(), filmComponentElement);
    };

    const hidePopup = () => {
      if (filmPopupComponent !== null) {
        document.body.removeChild(filmPopupComponent.getElement());
        filmPopupComponent = null;
      }
    };

    filmComponentElement.querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
      .forEach((element) => {
        element.addEventListener(`click`, (evt) => {
          if (element.tagName === `a`) {
            evt.preventDefault();
          }
          showPopup();
        });
      });

    render(filmListElement, filmComponentElement);
  }

  _renderNoFilms() {
    render(this._filmsSectionComponent, this._noFilmComponent);
  }

}
