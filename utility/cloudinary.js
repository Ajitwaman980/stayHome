const cloudinary = require("cloudinary").v2; //import the cloudinary

const dotenv = require("dotenv");

dotenv.config();

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// // console.log(process.env.CLOUD_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const upload_cloudinary = async (localPath) => {
//   try {
//     if (!localPath) return null;
//     const response = await cloudinary.uploader.upload(localPath, {
//       folder: "StayHome_images",
//       resource_type: "auto",
//     });
//     console.log(response);
//   } catch (error) {
//     fs.unlinkSync(localPath);
//     console.error("Error uploading file to Cloudinary:", error);
//   }
// };
const cloudinary_for_storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "StayHome_images",
    resource_type: "auto",
  },
});
// console.log(cloudinary_for_storage);
module.exports = cloudinary_for_storage;
