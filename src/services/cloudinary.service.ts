import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryService {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const cloudinaryService = ({
  cloud_name,
  api_key,
  api_secret,
}: CloudinaryService) => {
  console.info('<<<<< Configuring Cloudinary...');
  try {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
    console.info(`...cloudinary configured >>>>>`);
  } catch (error: any) {
    console.error(`Oops! Error configuring cloudinary: ${error} \n >>>>>`);
  }
};

export default cloudinaryService;
