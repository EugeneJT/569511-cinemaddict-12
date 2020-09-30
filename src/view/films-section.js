import AbstractView from './abstract.js';

const createFilmsSectionTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsSection extends AbstractView {

  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
