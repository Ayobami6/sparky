import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { EditCourseDto } from './dto/editcourse.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  async uploadCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return await this.courseService.uploadCourse(createCourseDto);
  }

  @UseGuards(AdminAuthGuard)
  @Put('edit/:id')
  async editCourse(
    @Body() editCourseDto: EditCourseDto,
    @Param('id') id: string,
  ): Promise<CourseEntity> {
    return await this.courseService.editCourse(id, editCourseDto);
  }
}
