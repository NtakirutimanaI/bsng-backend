import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'bsng_files',
  ): Promise<any> {
    const config = cloudinary.config();
    const isCloudinaryConfigured = config.api_key && 
                                   config.api_key !== 'your_api_key' &&
                                   config.api_key !== '';

    if (!isCloudinaryConfigured) {
      if (process.env.VERCEL) {
        throw new Error('CLOUD STORAGE ERROR: Cloudinary credentials (API KEY/SECRET) are missing in the Vercel environment. Please contact support to configure your cloud storage.');
      }
      console.warn('⚠️ CLOUDINARY NOT CONFIGURED: Falling back to ephemeral local storage.');
      
      const path = require('path');
      const fs = require('fs');
      
      const customDir = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(customDir)) {
        fs.mkdirSync(customDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '')}`;
      const savePath = path.join(customDir, filename);
      fs.writeFileSync(savePath, file.buffer);

      const urlPath = `/uploads/${folder}/${filename}`;
      return { secure_url: urlPath, url: urlPath, public_id: filename };
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto', // Automatically detects image, video, or raw (pdf, excel, etc.)
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

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'bsng',
  ): Promise<any> {
    return this.uploadFile(file, folder);
  }

  async deleteImage(publicId: string): Promise<any> {
    const config = cloudinary.config();
    const isCloudinaryConfigured = config.api_key && config.api_key !== 'your_api_key';
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
