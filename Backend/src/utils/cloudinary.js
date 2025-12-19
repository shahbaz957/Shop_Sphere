import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (filePath) => {
  try {

    console.log(process.env.CLOUDINARY_CLOUD_NAME)
    console.log(process.env.CLOUDINARY_API_KEY)
    console.log(process.env.CLOUDINARY_API_SECRET)
    if (!filePath) {
      console.log("No filePath is provided");
      return null;
    }
    console.log("File Path is : ", filePath);
    console.log("File exists:", fs.existsSync(filePath));

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("Upload Successfully : ", response.url);
    fs.unlinkSync(filePath); // this is for deleting the file saved in the folder
    return response;
  } catch (error) {
    console.log("Error Occured While Uplaoding on Cloudinary why error is here");
    console.log("FULL CLOUDINARY ERROR:", error?.message, error?.http_code, error);
    try {
      fs.unlinkSync(filePath);
    } catch (cleanUpErr) {
      console.log("Error Occurred while File Cleanup");
    }
    return null;
  }
};
