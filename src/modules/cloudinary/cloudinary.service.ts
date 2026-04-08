import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'bsng',
  ): Promise<any> {
    const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && 
                                   process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
                                   process.env.CLOUDINARY_API_KEY !== '';

    if (!isCloudinaryConfigured) {
      // NOTE: Render and Vercel use an EPHEMERAL filesystem. 
      // Files saved in 'uploads' will be deleted automatically on every restart or redeploy.
      // This local storage is only intended for local development testing.
      console.warn('⚠️ CLOUDINARY NOT CONFIGURED: Falling back to ephemeral local storage. Images WILL be lost on server restart.');
      
      const path = require('path');
      const fs = require('fs');
      
      const customDir = path.join(process.cwd(), 'uploads', 'img', 'custom');
      if (!fs.existsSync(customDir)) {
        fs.mkdirSync(customDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '.jpg')}`;
      const savePath = path.join(customDir, filename);
      fs.writeFileSync(savePath, file.buffer);

      const urlPath = `/img/custom/${filename}`;
      return { secure_url: urlPath, url: urlPath };
    }

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
    const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key';
    if (!isCloudinaryConfigured) {
       // Ignore deletes for local permanent storage to preserve history or handle manually later
       return Promise.resolve({ result: 'ok' });
    }
    
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
