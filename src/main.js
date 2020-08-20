import Profile from "./view/profile.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmView from "./view/films-card.js";
import FilmsSectionView from "./view/films-section.js";
import FilmsList from "./view/films-list.js";
import FilmsContainerView from "./view/films-container.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import PopupView from "./view/films-popup.js";
import ExtraFilmTemplateView from "./view/extra-film.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";


const FILMS_COUNT = 12;
const FILMS_COUNT_PER_STEP = 5;

const COUNT_TOP_RATED_FILMS = 2;
const COUNT_MOST_COMMENTED_FILMS = 2;

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmView(film);
  const filmPopupComponent = new PopupView(film);

  const replaceFilmToPopup = () => {
    filmListElement.replaceChild(filmPopupComponent.getElement(), filmComponent.getElement());
  };

  const replacePopupToFilm = () => {
    filmListElement.replaceChild(filmComponent.getElement(), filmPopupComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replacePopupToFilm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    replaceFilmToPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmPopupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replacePopupToFilm();
  });

  render(filmListElement, filmComponent.getElement());
};

const films = new Array(FILMS_COUNT).fill().map(createfilmCard);
const filters = generateFilter(films);

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    renderFilm(container, films[i]);
  }
};

const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

render(headerContainer, new Profile().getElement());
render(siteMainElement, new FilterView(filters).getElement());
render(siteMainElement, new SortView().getElement());

const filmsSectionComponent = new FilmsSectionView();
const filmsList = new FilmsList();
const filmsContainer = new FilmsContainerView();


render(siteMainElement, filmsSectionComponent.getElement());
render(filmsSectionComponent.getElement(), filmsList.getElement());
render(filmsList.getElement(), filmsContainer.getElement());


const minStep = Math.min(films.length, FILMS_COUNT_PER_STEP);
renderFilmsItem(filmsContainer.getElement(), minStep);


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


render(filmsSectionComponent.getElement(), new ExtraFilmTemplateView(`Top rated`).getElement());
render(filmsSectionComponent.getElement(), new ExtraFilmTemplateView(`Most commented`).getElement());

const filmsListExtraContainer = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsTopRatedContainer = filmsListExtraContainer[0];
const filmsMostCommentedContainer = filmsListExtraContainer[1];

renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS);
renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS);

