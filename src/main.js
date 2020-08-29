import ProfileView from "./view/profile.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import {FILMS_COUNT} from "./const.js";
import {createfilmCard} from "./mock/films-card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/render";
import Movies from "./presenter/movies.js";


const siteMainElement = document.querySelector(`.main`);
const headerContainer = document.querySelector(`.header`);


const films = new Array(FILMS_COUNT).fill().map(createfilmCard);
const filters = generateFilter(films);

render(headerContainer, new ProfileView().getElement());
render(siteMainElement, new FilterView(filters).getElement());
render(siteMainElement, new SortView().getElement());

Movies.init(films);
