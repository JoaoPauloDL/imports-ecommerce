import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadService {
  /**
   * Upload de imagem para Cloudinary
   * @param file - Buffer ou caminho do arquivo
   * @param folder - Pasta no Cloudinary (ex: 'products')
   * @returns URL segura da imagem
   */
  static async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products'
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `ecommerce/${folder}`,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' }, // Limita tamanho máximo
              { quality: 'auto:good' }, // Compressão automática
              { fetch_format: 'auto' }, // Formato otimizado (WebP quando possível)
            ],
          },
          (error, result) => {
            if (error) {
              console.error('Erro no upload Cloudinary:', error);
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            }
          }
        );

        // Envia o buffer do arquivo para o stream
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Erro no serviço de upload:', error);
      throw new Error('Falha ao fazer upload da imagem');
    }
  }

  /**
   * Upload de múltiplas imagens
   * @param files - Array de arquivos
   * @param folder - Pasta no Cloudinary
   * @returns Array de URLs
   */
  static async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'products'
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Erro ao fazer upload de múltiplas imagens:', error);
      throw new Error('Falha ao fazer upload das imagens');
    }
  }

  /**
   * Deletar imagem do Cloudinary
   * @param imageUrl - URL da imagem
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extrai o public_id da URL do Cloudinary
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex === -1) return;

      // Pega tudo depois de /upload/v12345678/
      const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
      // Remove a extensão do arquivo
      const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      // Não propaga o erro - se falhar ao deletar, não deve bloquear a operação
    }
  }

  /**
   * Deletar múltiplas imagens
   * @param imageUrls - Array de URLs
   */
  static async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map((url) => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao deletar múltiplas imagens:', error);
    }
  }
}
