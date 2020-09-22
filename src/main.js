import ProfileView from "./view/profile.js";
import StatisticView from "./view/statistic.js";
import FilmsSectionView from "./view/films-section.js";
import {FILMS_COUNT} from "./const.js";
import {createfilmCard} from "./mock/films-card.js";
import {render} from "./utils/render";
import MoviesModel from "./model/movies.js";
import MoviesPresenter from "./presenter/movies.js";


import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";


const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatistics = footerElement.querySelector(`.footer__statistics`);


let counter = 0;

const films = new Array(FILMS_COUNT).fill().map(() => {
  counter++;
  return createfilmCard(counter);
});


const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const filterModel = new FilterModel();


const filmsSection = new FilmsSectionView();
render(siteMainElement, filmsSection.getElement());

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const moviesPresenter = new MoviesPresenter(filmsSection, moviesModel, filterModel);

render(headerContainer, new ProfileView().getElement());
filterPresenter.init();
moviesPresenter.init();
render(footerStatistics, new StatisticView(films.length).getElement());
