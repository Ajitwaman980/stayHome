const cloudinary = require("cloudinary").v2; //import the cloudinary

const dotenv = require("dotenv");

dotenv.config();

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// console.log(process.env.CLOUD_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
