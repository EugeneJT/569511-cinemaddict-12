import AbstractView from "./abstract.js";

// Функцию для генерации HTML-разметки можно превратить в метод класса,
// однако делать мы этого не будем, чтобы не раздувать diff изменений

const createProfileTemplate = () => {
  return `<section class="header__profile profile">
      <p class="profile__rating">Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class Profile extends AbstractView {

  getTemplate() {
    return createProfileTemplate();
  }
}
