export const debounce = (f, delay) => {
  let timerId;

  const timer = (...arg) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...arg);
  };

  return timer;
};
