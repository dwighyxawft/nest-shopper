import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/images/products',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 10);
      const ext = extname(file.originalname);
      const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
      return callback(null, filename);
    },
  }),
};
