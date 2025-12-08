const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { asyncHandler }

// This function will manage the errors for every function we dont have to write manually everytime catch block for error
