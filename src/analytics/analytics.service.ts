import { Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/course/course.entity';
import { LoggerService } from 'src/logger.service';
import { OrderEntity } from 'src/order/order.entity';
import { Message } from 'src/user/types';
import { UserEntity } from 'src/user/user.entity';
import { ErrorException } from 'src/utils/error-exceptions';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  private userRepo;
  private courseRepo;
  private orderRepo;
  private errorException = new ErrorException();
  constructor(
    private dataSource: DataSource,
    private loggerService: LoggerService,
  ) {
    this.userRepo = this.dataSource.getRepository(UserEntity);
    this.orderRepo = this.dataSource.getRepository(OrderEntity);
    this.courseRepo = this.dataSource.getRepository(CourseEntity);
  }

  async getAnalytics(category: string): Promise<Message> {
    try {
      const catMap = {
        user: this.userRepo,
        course: this.courseRepo,
        order: this.orderRepo,
      };
      const repo = catMap[category.toLowerCase()];
      const last12MonthsData: Array<T> = [];

      // get current date
      const currentDate = new Date();
      // set current date to the next date
      currentDate.setDate(currentDate.getDate() + 1);

      for (let i = 11; i >= 0; i--) {
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - i * 28,
        );
        const startDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate() - 28,
        );

        const monthYear = endDate.toLocaleDateString('default', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        const count = await repo.countDocuments({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });
        last12MonthsData.push({
          month: monthYear,
          count,
        });
      }
      return {
        success: true,
        data: last12MonthsData,
      };
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }
}
