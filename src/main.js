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
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

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

