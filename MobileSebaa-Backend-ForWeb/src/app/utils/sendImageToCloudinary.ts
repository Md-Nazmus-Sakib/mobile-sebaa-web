import multer from 'multer';
import config from '../config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with credentials from the config file
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

/**
 * Uploads an image to Cloudinary.
 *
 * @param imageName - The desired public ID for the image on Cloudinary.
 * @param path - The local file path of the image to upload.
 * @returns A promise that resolves to the Cloudinary response or rejects with an error.
 */
export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error); // Reject the promise if there's an error
        }
        resolve(result as UploadApiResponse); // Resolve the promise with the Cloudinary response

        // Delete the local file asynchronously after upload
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err); // Log error if file deletion fails
          } else {
            console.log('File is deleted.'); // Confirm successful file deletion
          }
        });
      },
    );
  });
};

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/'); // Save files to the 'uploads' folder
  },
  // Define the filename format for uploaded files
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Append a unique suffix to the filename
  },
});

// Export the Multer upload middleware configured with the defined storage options
export const upload = multer({ storage: storage });
