import multer from 'multer'

const eventStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./upload/EventImage");
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
}) 

export const eventImgUpload = multer({
  storage:eventStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,//10mb
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
 
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    }
    cb(null, true);
  },
});

