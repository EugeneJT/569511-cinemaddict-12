import AbstractView from './abstract.js';

const createFooterStatistic = (quantityOfFilms) => {

  return (
    `<section class="footer__statistics">
    <p>${quantityOfFilms} movies inside</p>
  </section>`
  );
};

export default class FooterStatistics extends AbstractView {
  constructor(quantityOfFilms) {
    super();
    this._quantityOfFilms = quantityOfFilms;
  }

  getTemplate() {
    return createFooterStatistic(this._quantityOfFilms);
  }

}
