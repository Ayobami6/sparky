import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { EditCourseDto } from './dto/editcourse.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/user/types';
import { QuestionDto, QuestionReplyDto } from './dto/add-question.dto';

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

  @Get(':id')
  async getCourseForAllUsers(@Param('id') id: string): Promise<CourseEntity> {
    return await this.courseService.getCourseForAll(id);
  }

  @Get('')
  async getAllCourses(): Promise<CourseEntity[]> {
    return await this.courseService.allCourses();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('ca/:id')
  async findCourseById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.getCourse(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('q/add')
  async addQuestion(
    @Body() questionDto: QuestionDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.addQuestion(questionDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('q/reply')
  async replyQuestion(
    @Body() questionReplyDto: QuestionReplyDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.replyQuestion(questionReplyDto, user);
  }
}
