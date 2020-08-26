import ProfileView from "./view/profile.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmView from "./view/films-card.js";
import FilmsSectionView from "./view/films-section.js";
import FilmsListView from "./view/films-list.js";
import NoFilmView from "./view/no-film.js";
import FilmsContainerView from "./view/films-container.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import PopupView from "./view/films-popup.js";
import ExtraFilmTemplateView from "./view/extra-film.js";
import {FILMS_COUNT, FILMS_COUNT_PER_STEP, COUNT_TOP_RATED_FILMS, COUNT_MOST_COMMENTED_FILMS, KeyCode} from "./const.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";


const renderFilm = (filmListElement, film) => {
  const filmComponentElement = new FilmView(film).getElement();
  let filmPopupComponent = null;

  const showPopup = () => {
    hidePopup();

    filmPopupComponent = new PopupView(film);

    filmPopupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
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
};

const films = new Array(FILMS_COUNT).fill().map(createfilmCard);

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    renderFilm(container, films[i]);
  }
};

const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

const filmsSectionComponent = new FilmsSectionView();
const filmsList = new FilmsListView();
const filmsContainer = new FilmsContainerView();
const filters = generateFilter(films);


const renderLoadMoreButton = () => {
  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmCount = FILMS_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(filmsList.getElement(), loadMoreButtonComponent.getElement());


    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsContainer.getElement(), film));

      renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }

    });
  }
};

const renderExtraFilms = () => {
  render(filmsSectionComponent.getElement(), new ExtraFilmTemplateView(`Top rated`).getElement());
  render(filmsSectionComponent.getElement(), new ExtraFilmTemplateView(`Most commented`).getElement());

  const filmsListExtraContainer = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
  const filmsTopRatedContainer = filmsListExtraContainer[0];
  const filmsMostCommentedContainer = filmsListExtraContainer[1];

  renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS);
  renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS);
};

const renderContent = () => {
  render(headerContainer, new ProfileView().getElement());
  render(siteMainElement, new FilterView(filters).getElement());
  render(siteMainElement, new SortView().getElement());
  render(siteMainElement, filmsSectionComponent.getElement());

  if (films.length <= 0) {
    const noFilm = new NoFilmView();
    render(filmsSectionComponent.getElement(), noFilm.getElement());

  } else {

    render(filmsSectionComponent.getElement(), filmsList.getElement());
    render(filmsList.getElement(), filmsContainer.getElement());

    const minStep = Math.min(films.length, FILMS_COUNT_PER_STEP);
    renderFilmsItem(filmsContainer.getElement(), minStep);

    renderLoadMoreButton();

    renderExtraFilms();
  }
};

renderContent();
