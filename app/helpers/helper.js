export const wait = (timeout = 1500) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const waitForModal = () => {
  return wait(500);
};
