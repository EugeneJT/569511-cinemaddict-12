import Profile from "./view/profile.js";
import {createFilterTemplate} from "./view/filter.js";
import SortView from "./view/sort.js";
import {createFilmsCardTemplate} from "./view/films-card.js";
import FilmsSectionView from "./view/films-section.js";
import FilmsList from "./view/films-list.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import {createFilmsPupupTemplate} from "./view/films-popup.js";
import {createExtraFilmTemplate} from "./view/extra-film.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";
import {renderTemplate, renderElement} from "./utils.js";


const FILMS_COUNT = 12;
const FILMS_COUNT_PER_STEP = 5;

const COUNT_TOP_RATED_FILMS = 2;
const COUNT_MOST_COMMENTED_FILMS = 2;

const filmsList = new FilmsList();


const films = new Array(FILMS_COUNT).fill().map(createfilmCard);
const filters = generateFilter(films);

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    renderTemplate(container, createFilmsCardTemplate(films[i]));
  }
};

const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

renderElement(headerContainer, new Profile().getElement());
renderTemplate(siteMainElement, createFilterTemplate(filters));
renderElement(siteMainElement, new SortView().getElement());

const FilmsSectionComponent = new FilmsSectionView();
renderElement(siteMainElement, FilmsSectionComponent.getElement());

const filmsElement = siteMainElement.querySelector(`.films`);

renderElement(filmsElement, filmsList.getElement());

const filmsListContainer = filmsElement.querySelector(`.films-list__container`);

const minStep = Math.min(films.length, FILMS_COUNT_PER_STEP);
renderFilmsItem(filmsListContainer, minStep);


if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  const loadMoreButtonComponent = new LoadMoreButtonView();

  renderElement(filmsList.getElement(), loadMoreButtonComponent.getElement());


  loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainer, createFilmsCardTemplate(film)));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }

  });
}


renderTemplate(filmsElement, createExtraFilmTemplate(`Top rated`));
renderTemplate(filmsElement, createExtraFilmTemplate(`Most commented`));


const filmsListExtraContainer = filmsElement.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsTopRatedContainer = filmsListExtraContainer[0];
const filmsMostCommentedContainer = filmsListExtraContainer[1];

renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS);
renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS);

const footerContainer = document.querySelector(`.footer`);
//renderTemplate(footerContainer, createFilmsPupupTemplate(films[0]));

