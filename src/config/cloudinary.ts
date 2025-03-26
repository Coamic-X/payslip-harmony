
import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dbpqkfw2x',
  },
  url: {
    secure: true, // https
  },
});

export default cloudinary;
