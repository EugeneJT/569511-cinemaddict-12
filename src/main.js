import {UpdateType} from './const.js';
import {render, remove} from "./utils/render";

import StatisticView from "./view/statistic.js";
import FilmsSectionView from "./view/films-section.js";
import StatisticsView from './view/statistics.js';

import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";

import MoviesPresenter from "./presenter/movies.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from './presenter/user-profile.js';
import Api from './api.js';


let statisticComponent;
const AUTHORIZATION = `Basic qr866jdzbbs`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

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


const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const filmsSection = new FilmsSectionView();
const userProfilePresenter = new UserProfilePresenter(headerContainer, moviesModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, handleStatisticClick, handleMenuItemClick);
const moviesPresenter = new MoviesPresenter(filmsSection, moviesModel, filterModel, api);

userProfilePresenter.init();
render(siteMainElement, filmsSection.getElement());
filterPresenter.init();
moviesPresenter.init();

api.getMovies()
  .then((movies) => api.pullComments(movies))
  .then((films) => {
    MoviesModel.setMovies(UpdateType.INIT, films);
    render(footerStatistics, new StatisticView(films.length).getElement());
    filterPresenter.unlock();
  });
