import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//** using Cloudnary or cloudnary multer storage only **/ /

// Configure once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath:string):Promise<any> => {
  try {
    if (!filePath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "SocialEvent",
      resource_type: "auto",
    });
    console.log("Image upload result : ",uploadResult);
    
    console.log(
      `response from upload_Imgae_Result secure_url : ${JSON.stringify(uploadResult.secure_url)}`,
    );
    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      // delete the local file immediately using file system module :
      fs.unlinkSync(filePath);
    }
    const { secure_url, public_id } = uploadResult;
    return { secure_url, public_id };
  } catch (error) {
    // Only delete file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("cloudinary error ", error);
    throw error;
  }
};

const deletefromCloudnay = async (existPublicid:string) => {
  try {
    return await cloudinary.uploader.destroy(existPublicid);
  } catch (error) {
    console.log("error occured druing deletion from cloudnary : ", error);
    return error;
  }
};

//** using Cloudnary or cloudnary multer storage only **/ /

export { uploadOnCloudinary, deletefromCloudnay };