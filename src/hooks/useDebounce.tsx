// @ts-nocheck

export const useDebounce = (handler: any, delay = 500) => {
  let timeout;
  return function (...args: any) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      handler.apply(context, args);
    }, delay);
  };
};
