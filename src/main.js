import {createProfileTemplate} from "./view/profile.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsCardTemplate} from "./view/films-card.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createShowMoreButtonTemplate} from "./view/load-more-button.js";
import {createFilmsPupupTemplate} from "./view/films-popup.js";
import {createExtraFilmTemplate} from "./view/extra-film.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsItem = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createFilmsCardTemplate(), `beforeend`);
  }
};


const mainContainer = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);

render(headerContainer, createProfileTemplate(), `beforeend`);
render(mainContainer, createMenuTemplate(), `beforeend`);
render(mainContainer, createSortTemplate(), `beforeend`);
render(mainContainer, createFilmsTemplate(), `beforeend`);

const filmsContainer = mainContainer.querySelector(`.films`);

render(filmsContainer, createFilmsListTemplate(), `beforeend`);

const filmsListContainer = filmsContainer.querySelector(`.films-list__container`);

renderFilmsItem(filmsListContainer, 5);

const filmsList = filmsContainer.querySelector(`.films-list`);
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);


render(filmsContainer, createExtraFilmTemplate(`Top rated`), `beforeend`);
render(filmsContainer, createExtraFilmTemplate(`Most commented`), `beforeend`);


const filmsListExtraContainer = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsTopRatedContainer = filmsListExtraContainer[0];
const filmsMostCommentedContainer = filmsListExtraContainer[1];

renderFilmsItem(filmsTopRatedContainer, 2);
renderFilmsItem(filmsMostCommentedContainer, 2);

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, createFilmsPupupTemplate(), `beforeend`);
