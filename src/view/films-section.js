import AbstractView from "./abstract.js";

const createFilmsTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsSection extends AbstractView {

  getTemplate() {
    return createFilmsTemplate();
  }
}
