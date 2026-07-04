let storedFile = null;

export const setStoredFile = (file) => {
  storedFile = file;
};

export const getStoredFile = () => {
  const file = storedFile;
  storedFile = null; // Clear after retrieving
  return file;
};
