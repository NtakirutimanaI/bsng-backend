import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'bsng',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed: no result'));
          resolve(result);
        },
      );
      
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  extractPublicId(url: string): string | null {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    // Cloudinary URL format: 
    // https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[filename].[ext]
    // We need [folder]/[filename]
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // Everything after v[version]/
    const relevantParts = parts.slice(uploadIndex + 2);
    const lastPart = relevantParts[relevantParts.length - 1];
    
    // Remove extension
    const filenameWithoutExt = lastPart.split('.')[0];
    relevantParts[relevantParts.length - 1] = filenameWithoutExt;
    
    return relevantParts.join('/');
  }
}
