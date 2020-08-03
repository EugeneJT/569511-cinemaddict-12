import {createProfileTemplate} from "./view/profile.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsCardTemplate} from "./view/films-card.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createShowMoreButtonTemplate} from "./view/load-more-button.js";
import {createFilmsPupupTemplate} from "./view/films-popup.js";
import {createExtraFilmTemplate} from "./view/extra-film.js";

const COUNT_FILMS = 5;
const COUNT_TOP_RATED_FILMS = 2;
const COUNT_MOST_COMMENTED_FILMS = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createFilmsCardTemplate());
  }
};


const mainContainer = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

render(headerContainer, createProfileTemplate());
render(mainContainer, createMenuTemplate());
render(mainContainer, createSortTemplate());
render(mainContainer, createFilmsTemplate());

const filmsContainer = mainContainer.querySelector(`.films`);

render(filmsContainer, createFilmsListTemplate());

const filmsListContainer = filmsContainer.querySelector(`.films-list__container`);

renderFilmsItem(filmsListContainer, COUNT_FILMS);

const filmsList = filmsContainer.querySelector(`.films-list`);
render(filmsList, createShowMoreButtonTemplate());


render(filmsContainer, createExtraFilmTemplate(`Top rated`));
render(filmsContainer, createExtraFilmTemplate(`Most commented`));


const filmsListExtraContainer = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsTopRatedContainer = filmsListExtraContainer[0];
const filmsMostCommentedContainer = filmsListExtraContainer[1];

renderFilmsItem(filmsTopRatedContainer, COUNT_TOP_RATED_FILMS);
renderFilmsItem(filmsMostCommentedContainer, COUNT_MOST_COMMENTED_FILMS);

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, createFilmsPupupTemplate());
