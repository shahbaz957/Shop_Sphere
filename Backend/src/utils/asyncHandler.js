export const aysncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      next(err);
    });
  };
};

// This function will manage the errors for every function we dont have to write manually everytime catch block for error
