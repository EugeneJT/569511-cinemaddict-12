import {FILMS_COUNT} from "./const.js";
import {createfilmCard} from "./mock/films-card.js";
import {render, remove} from "./utils/render";

import StatisticView from "./view/statistic.js";
import FilmsSectionView from "./view/films-section.js";
import StatisticsView from './view/statistics.js';

import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";

import MoviesPresenter from "./presenter/movies.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from './presenter/user-profile.js';

let statisticComponent;


const handleStatisticClick = () => {
  if (statisticComponent) {
    remove(statisticComponent);
  }
  moviesPresenter.destroy();
  statisticComponent = new StatisticsView(moviesModel.getMovies());
  render(siteMainElement, statisticComponent);
};

const handleMenuItemClick = () => {
  if (moviesPresenter.destroyed) {
    moviesPresenter.init();
    remove(statisticComponent);
  }
};

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
const userProfilePresenter = new UserProfilePresenter(headerContainer, moviesModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, handleStatisticClick, handleMenuItemClick);
const moviesPresenter = new MoviesPresenter(filmsSection, moviesModel, filterModel);

userProfilePresenter.init();
render(siteMainElement, filmsSection.getElement());
filterPresenter.init();
moviesPresenter.init();
render(footerStatistics, new StatisticView(films.length).getElement());
