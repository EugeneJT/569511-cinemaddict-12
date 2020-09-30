import UserProfilePresenter from './presenter/user-profile.js';
import FooterStatisticsView from './view/footer-statisctics.js';
import MoviesPresenter from './presenter/movies.js';
import MovieModel from './model/movies.js';
import FilterModel from './model/filter.js';
import FilterPresenter from "./presenter/filter.js";
import StatisticView from './view/statistics.js';
import Api from './api.js';
import {render} from './utils/render.js';
import {MenuItem, UpdateType, AUTHORIZATION, END_POINT} from './const.js';

const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteHeaderElement = document.querySelector(`.header`);

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MovieModel();
const filtersModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filtersModel, moviesModel);
const moviePresenter = new MoviesPresenter(siteMainElement, moviesModel, filtersModel, api);

const handleSiteMenuClick = (menuItem) => {
  if (menuItem === currentMenuMode) {
    return;
  }

  switch (menuItem) {
    case MenuItem.FILTER:
      currentMenuMode = menuItem;
      siteStatistic.destroy();
      moviePresenter.init();
      break;
    case MenuItem.STATISTICS:
      currentMenuMode = menuItem;
      siteStatistic = new StatisticView(moviesModel.getMovies(), siteMainElement);
      moviePresenter.destroy();
      break;
  }
};

let siteStatistic = null;
let currentMenuMode = MenuItem.FILTER;

filterPresenter.init();
moviePresenter.init();

let films = null;
api.getMovies().then((movies) => {
  films = movies;
  return Promise.all(movies.map((movie)=>api.getComments(movie.id)));
}).then((comments) => {
  films.forEach((film, index) => {
    film.comments = comments[index];
  });
  moviesModel.setMovies(UpdateType.INIT, films);
  filterPresenter.turnOnFilters();
  filterPresenter.setMenuClickHandler(handleSiteMenuClick);
  const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, moviesModel);
  userProfilePresenter.init();
  render(siteFooterElement, new FooterStatisticsView(moviesModel.getMovies().length));
})
.catch(() => {
  moviesModel.setMovies(UpdateType.INIT, []);
});
