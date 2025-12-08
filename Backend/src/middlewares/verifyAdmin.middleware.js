import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user && !user.email) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, {}, "Unauthorized Access. Only Admin is Allowed")
        );
    }
    if (user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, {}, "Unauthorized Access. Only Admin is Allowed")
        );
    }
    user.isAdmin = true;
    await user.save()
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, "Server Error"));
  }
});
