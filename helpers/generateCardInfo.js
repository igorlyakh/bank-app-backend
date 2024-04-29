const getNumber = () => {
  return Math.floor(Math.random() * (1e16 - 1e15) + 1e15);
};

const getYear = () => {
  const date = new Date();
  const getYear = date.getFullYear() % 100;
  const year = getYear + 5;
  return year;
};

const getMonth = () => {
  const date = new Date();
  const fullMonth = date.getMonth() + 1;
  return fullMonth;
};

const getCvv = () => {
  return Math.floor(Math.random() * 900) + 100;
};

module.exports = { getNumber, getYear, getMonth, getCvv };
