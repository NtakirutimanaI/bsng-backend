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
}
