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
