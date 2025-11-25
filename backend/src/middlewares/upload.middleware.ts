import multer from 'multer';
import { Request } from 'express';

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceita apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'));
  }
};

// Middleware de upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
  },
});

// Upload de uma única imagem
export const uploadSingle = upload.single('image');

// Upload de múltiplas imagens (até 5)
export const uploadMultiple = upload.array('images', 5);
