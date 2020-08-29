import AbstractView from "./abstract.js";

const createExtraFilmTemplate = (title) => {
  return `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`;
};

export default class ExtraFilmTemplate extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createExtraFilmTemplate(this._title);
  }
}
