import {remove} from '../utils/render.js';
import AbstractView from './abstract.js';

const createFilmsListSection = (className) => {

  return (
    `<section class="${className}">
    </section>`
  );
};

export default class FilmsListSection extends AbstractView {
  constructor(className) {
    super();
    this._className = className;
  }

  getTemplate() {
    return createFilmsListSection(this._className);
  }

  destroy() {
    remove(this);
  }
}
