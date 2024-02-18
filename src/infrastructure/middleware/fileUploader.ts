import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

interface IMIME_TYPE_MAP {
  [key: string]: string;
}

const MIME_TYPE_MAP: IMIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limits: {
    fieldSize: 10485760, //10Mb
    files: 1,
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext: string = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid: boolean = !!MIME_TYPE_MAP[file.mimetype];
    //let error: Error | null = isValid ? null : new Error('Invalid MIMETYPE!!');
    cb(null, isValid);
  },
});

export default fileUpload.single('profileImage');
