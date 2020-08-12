import {createProfileTemplate} from "./view/profile.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsCardTemplate} from "./view/films-card.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createShowMoreButtonTemplate} from "./view/load-more-button.js";
import {createFilmsPupupTemplate} from "./view/films-popup.js";
import {createExtraFilmTemplate} from "./view/extra-film.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";


const FILMS_COUNT = 12;
const FILMS_COUNT_PER_STEP = 5;

const COUNT_TOP_RATED_FILMS = 2;
const COUNT_MOST_COMMENTED_FILMS = 2;

const films = new Array(FILMS_COUNT).fill().map(createfilmCard);
const filters = generateFilter(films);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createFilmsCardTemplate(films[i]));
  }
};

const mainContainer = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

render(headerContainer, createProfileTemplate());
render(mainContainer, createFilterTemplate(filters));
render(mainContainer, createSortTemplate());
render(mainContainer, createFilmsTemplate());

const filmsContainer = mainContainer.querySelector(`.films`);

render(filmsContainer, createFilmsListTemplate());

const filmsListContainer = filmsContainer.querySelector(`.films-list__container`);

const minStep = Math.min(films.length, FILMS_COUNT_PER_STEP);
renderFilmsItem(filmsListContainer, minStep);


const filmsList = filmsContainer.querySelector(`.films-list`);

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsList, createShowMoreButtonTemplate());

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createFilmsCardTemplate(film)));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }

  });
}


render(filmsContainer, createExtraFilmTemplate(`Top rated`));
render(filmsContainer, createExtraFilmTemplate(`Most commented`));


const filmsListExtraContainer = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsTopRatedContainer = filmsListExtraContainer[0];
const filmsMostCommentedContainer = filmsListExtraContainer[1];

renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS);
renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS);

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, createFilmsPupupTemplate(films[0]));

