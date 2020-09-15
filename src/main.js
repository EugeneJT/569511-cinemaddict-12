import ProfileView from "./view/profile.js";
import FilterView from "./view/filter.js";
import StatisticView from "./view/statistic.js";
import FilmsSectionView from "./view/films-section.js";
import {FILMS_COUNT} from "./const.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/render";
import MoviesView from "./presenter/movies.js";


const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatistics = footerElement.querySelector(`.footer__statistics`);

let counter = 0;

const films = new Array(FILMS_COUNT).fill().map(() => {
  counter++;
  return createfilmCard(counter);
});
const filters = generateFilter(films);

render(headerContainer, new ProfileView().getElement());
render(siteMainElement, new FilterView(filters).getElement());

const filmsSection = new FilmsSectionView();
render(siteMainElement, filmsSection.getElement());

const movies = new MoviesView(filmsSection);
movies.init(films);

render(footerStatistics, new StatisticView(films.length).getElement());
