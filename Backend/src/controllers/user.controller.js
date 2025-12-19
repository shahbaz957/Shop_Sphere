import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { uploadCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/Cart.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, profileImage, password } = req.body;
  console.log(username);
  if (
    [username, email, fullName, profileImage, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(422, "Please Provide The Complete Details");
  }

  const alreadyUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (alreadyUser) {
    throw new ApiError(409, "User Already Existed in Database");
  }

  const profileImageLocalPath = req.file.path;
  if (!profileImageLocalPath) {
    throw new ApiError(422, "Image is Required for registration");
  }
  const profileImageUpload = await uploadCloudinary(profileImageLocalPath);
  if (!profileImageUpload) {
    throw new ApiError(502, "Failed to upload on Cloudinary"); // 502 Bad Gateway Error
  }
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    profileImage: {
      url: profileImageUpload.url,
      public_id: profileImageUpload.public_id,
    },
  });
  console.log(user);
  if (!user) {
    throw new ApiError(501, "User is not Created Successfully");
  }

  await Cart.create({ userId: user._id, Items: [] }); // just as a business Rule

  const createdUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );
  if (!createdUser) {
    throw new ApiError(500, "User is not Fetched Successfully from DB");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User is registered Successfully"));
});

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshTokens();
    const accessToken = user.generateAccessTokens();

    user.refreshTokens = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error Occured While Generating tokens");
  }
};  

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(422, "Both Fields are required for Logging In");
  }

   const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not Valid");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );
  console.log(loggedInUser)


  const options = {
  httpOnly: true,
  secure: false,                    
  sameSite: "lax",                        
};

res
  .status(200) 
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken,options )
  .json(
    new ApiResponse(200, {
      user: loggedInUser,
      accessToken,    
      refreshToken
    }, "User logged in successfully")
  );
});

const logOutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(
      404,
      "User not Found. You are Not authenticated please Login"
    );
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshTokens: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "User Successfully Updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User Not Found please Login Again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Successfully Fetched the User"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.isAdmin) {
    throw new ApiError(401, "You are Not Authorized");
  }
  const allUsers = await User.find({ isAdmin: false });
  if (!allUsers) {
    throw new ApiError(500, "Server failed to fetch the Users");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, allUsers, "Successfully Fetched ALl the Users"));
});

const getTotalUserCount = asyncHandler(async (req, res) => {
  const total = (await User.countDocuments()) - 1; // that one is admin
  if (!total) {
    throw new ApiError(500, "Total Count is not fetched");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, total, "Total Count is Fetched"));
});

export { registerUser, loginUser, logOutUser, getCurrentUser, getAllUser , getTotalUserCount };
