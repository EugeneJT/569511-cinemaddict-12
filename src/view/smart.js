import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(newData, isUpdateDataOnly) {
    if (!newData) {
      return;
    }

    this._data = Object.assign({}, this._data, newData);

    if (isUpdateDataOnly) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
    this.restoreComments();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }

  restoreComments() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }
}
