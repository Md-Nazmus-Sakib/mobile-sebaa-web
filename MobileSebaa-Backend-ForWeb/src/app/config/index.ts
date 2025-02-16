import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
