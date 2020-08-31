import AbstractView from "./abstract.js";

export default class Statistic extends AbstractView {

  constructor(filmsAmount) {
    super();
    this.filmsAmount = filmsAmount;
  }

  getTemplate() {
    return `<p>${this.filmsAmount} movies inside</p>`;
  }
}
