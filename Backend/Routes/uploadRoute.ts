import express from "express";
import multer from "multer";
import { eventImgUpload } from "../utils/multer";
import { uploadOnCloudinary } from "../utils/cloudinary";

const router = express.Router();

router.post(
  "/event-image",
  eventImgUpload.single("eventImg"),
  async (req, res) => {
    console.log("req.file : ",req.file);
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = await uploadOnCloudinary(req.file.path);

      return res.status(200).json({ imageUrl });
    } catch (error: any) {
      console.error("Image upload error:", error);
      return res.status(500).json({ error: error.message || "Upload failed" });
    }
  },
);

export default router;
