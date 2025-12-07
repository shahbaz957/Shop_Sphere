import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      console.log("No filePath is provided");
      return null;
    }
    console.log("File Path is : ", filePath);

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("Upload Successfully : ", response.url);
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    console.log("Error Occured While Uplaoding on Cloudinary");
    try {
      fs.unlinkSync(filePath);
    } catch (cleanUpErr) {
      console.log("Error Occurred while File Cleanup");
    }
    return null;
  }
};
