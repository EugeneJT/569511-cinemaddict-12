
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFractionInteger = (a = 0, b = 1) => {
  const randomInteger = Math.random() * (b - a) + a;
  const randomFractionInteger = Math.floor(randomInteger * 10) / 10;

  return randomFractionInteger;
};

export const getRandomItem = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomArray = (array) => {
  return array.filter(getRandomBoolean);
};

export const getRandomItems = (array) => {
  return getRandomArray(array).join();
};

export const getCapitalizedFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const sortTopRated = (films) => {
  return films.sort((a, b) => b.rating - a.rating);
};


export const sortByDate = (films) => {
  return films.sort((a, b) => {
    return b.releaseDate.getTime() - a.releaseDate.getTime();
  });
};

export function sortMostComments(films) {
  films.sort(function (a, b) {
    return b.comments.length - a.comments.length;
  });
}

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const generateID = () => {
  return Date.now() + parseInt(Math.random() * 10000, 10);
};
