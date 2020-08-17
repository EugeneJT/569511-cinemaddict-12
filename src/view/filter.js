const createFilterItemTemplate = (filter) => {

  const {name, count} = filter;
  const title = name.toUpperCase();

  return (
    `
      <a href="#${name}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>
    `
  );
};


export const createFilterTemplate = (filterItems) => {
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
