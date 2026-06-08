import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function generateImageUrl(publicId: string, width = 800, format = 'auto') {
  return cloudinary.url(publicId, {
    width,
    format,
    crop: 'fill',
    quality: 'auto'
  });
}

export async function createCloudinaryUploadSignature() {
  return cloudinary.utils.api_sign_request({}, process.env.CLOUDINARY_API_SECRET || '');
}
