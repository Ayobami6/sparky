import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { ErrorException } from 'src/utils/error-exceptions';
import { DataSource } from 'typeorm';
import { LayoutEntity } from './layout.entity';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { Message } from 'src/user/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class LayoutService {
  private layoutRepo;
  private errorException = new ErrorException();

  constructor(
    private dataSource: DataSource,
    private loggerService: LoggerService,
    private cloudinaryService: CloudinaryService,
  ) {
    this.layoutRepo = this.dataSource.getRepository(LayoutEntity);
  }

  async createLayout(createLayoutDto: CreateLayoutDto): Promise<Message> {
    try {
      const { type, faq, categories, banner } = createLayoutDto;
      const layoutExist = await await this.layoutRepo.findOne({
        where: {
          type: type,
        },
      });
      if (layoutExist)
        throw new HttpException(
          "Can't create multiple layouts for one type",
          HttpStatus.BAD_REQUEST,
        );
      if (type === 'Banner') {
        // destructure banner object and uppload image to cloudinary
        const { image, title, subtitle } = banner;
        const response = await this.cloudinaryService.upload(image, {
          folder: 'banners',
        });
        const bannerObj = {
          image: {
            public_id: response.public_id,
            url: response.secure_url,
          },
          title,
          subtitle,
        };
        const layout = this.layoutRepo.create({
          type,
          banner: bannerObj,
        });
        await this.layoutRepo.save(layout);
      }
      if (type === 'FAQ') {
        const layout = this.layoutRepo.create({
          type,
          faq,
        });
        await this.layoutRepo.save(layout);
      }
      if (type === 'Category') {
        const layout = this.layoutRepo.create({
          type,
          categories,
        });
        await this.layoutRepo.save(layout);
      }
      return { success: true, message: `${type} Layout Successfully Created` };
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }

  async findLayoutByType(type: string): Promise<LayoutEntity> {
    try {
      const layout = await this.layoutRepo.findOne({
        where: {
          type: type,
        },
      });
      if (!layout) {
        throw new NotFoundException(`Layout ${type} not found`);
      }
      return layout;
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }

  // edit layout
  async editLayout(createLayoutDto: CreateLayoutDto): Promise<Message> {
    try {
      const { type, faq, categories, banner } = createLayoutDto;
      if (type === 'Banner') {
        // destructure banner object and uppload image to cloudinary
        const { image, title, subtitle } = banner;
        const bannerLayout = await this.findLayoutByType('Banner');
        if (bannerLayout.banner.image.public_id) {
          await this.cloudinaryService.delete(
            bannerLayout.banner.image.public_id,
          );
        }
        const response = await this.cloudinaryService.upload(image, {
          folder: 'banners',
        });
        const bannerObj = {
          image: {
            public_id: response.public_id,
            url: response.secure_url,
          },
          title,
          subtitle,
        };
        const layout = await this.layoutRepo.merge(bannerLayout, {
          type,
          banner: bannerObj,
        });
        await this.layoutRepo.save(layout);
      }
      if (type === 'FAQ') {
        const faqLayout = await this.findLayoutByType('FAQ');
        const layout = await this.layoutRepo.merge(faqLayout, {
          type,
          faq,
        });
        await this.layoutRepo.save(layout);
      }
      if (type === 'Category') {
        const catLayout = await this.findLayoutByType('Category');
        const layout = await this.layoutRepo.merge(catLayout, {
          type,
          categories,
        });
        await this.layoutRepo.save(layout);
      }
      return { success: true, message: `${type} Layout Successfully Updated` };
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }
}
