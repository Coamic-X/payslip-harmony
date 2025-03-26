
import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance with your credentials
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dbpqkfw2x',
  },
  url: {
    secure: true, // https
  },
});

// Add API credentials for uploads
export const cloudinaryConfig = {
  cloudName: 'dbpqkfw2x',
  apiKey: '695637838557724',
  apiSecret: 'bYVJdeUK-7JrFtHxq8I9QyVimkg',
  uploadPreset: 'mz92r9oz', // Using a different upload preset
};

export default cloudinary;
