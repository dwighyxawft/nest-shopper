import { diskStorage } from 'multer';
import { extname } from 'path';

export const profileConfig = {
    storage: diskStorage({
      destination: "./uploads/users",
      filename: (req, file, callback) => {
        const uniqueSuffix = (Date.now() + "-" + req.user["sub"]);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        return callback(null, filename);
      }
    })
  }