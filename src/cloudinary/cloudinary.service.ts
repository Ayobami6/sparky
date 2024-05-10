import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  logger = new Logger();
  constructor(private configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUD_API_KEY'),
      api_secret: this.configService.get<string>('CLOUD_SECRET_KEY'),
    });
  }
  async upload(avatar: any, options: any): Promise<any> {
    try {
      return await cloudinary.v2.uploader.upload(avatar, options);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
  async delete(publicId: string): Promise<any> {
    try {
      return await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
