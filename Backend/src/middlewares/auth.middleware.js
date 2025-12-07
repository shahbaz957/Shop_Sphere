import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "UnAuthorized Access is detected");
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) {
      throw new ApiError(401, "Token is not verified");
    }
    // this verified now contain the payload data that you signed while signing

    const user = await User.findById(verified?._id).select(
      "-password -refreshTokens"
    );

    if (!user) {
      throw new ApiError(404, "User not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "User is Not Authorized");
  }
});
