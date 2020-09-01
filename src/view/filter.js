import AbstractView from "./abstract.js";
import {getCapitalizedFirstLetter} from "../utils/common.js";

const createFilterItemTemplate = (filter) => {

  const {name, count} = filter;
  const title = getCapitalizedFirstLetter(name);

  const createFilterCountTemplate = () => {
    return `<span class="main-navigation__item-count">
      ${count}
    </span>`;
  };

  return (
    `
      <a href="#${name}" class="main-navigation__item">${title}${name !== `all` ? createFilterCountTemplate() : ` movies`}</a>
    `
  );
};


const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
