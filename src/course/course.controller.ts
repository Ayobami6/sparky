import {
  Body,
  Controller,
  Delete,
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
import { AddReviewDTO, ReviewReplyDto } from './dto/add-review.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateVideoUrlDto } from './dto/generate-videourl.dto';

@Controller('courses')
@ApiTags('courses')
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

  @Get('for-all/:id')
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
  @ApiOperation({ summary: 'Add a new question to a course' })
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

  @UseGuards(AuthGuard('jwt'))
  @Put('review/add/:id')
  async addReview(
    @Body() reviewDto: AddReviewDTO,
    @GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<Message> {
    return await this.courseService.addReview(user, reviewDto, id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('review/reply/:id')
  async editReview(
    @Body() reviewReplyDto: ReviewReplyDto,
    @GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<Message> {
    return await this.courseService.addReplyToReview(user, reviewReplyDto, id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('all-courses/')
  async allCourses(): Promise<Message> {
    return await this.courseService.getAllCourses();
  }

  // delete course
  @UseGuards(AdminAuthGuard)
  @Delete('delete/:id')
  async deleteCourse(@Param('id') id: string): Promise<Message> {
    return await this.courseService.deleteCourse(id);
  }

  @Post('generate-videoUrl')
  async generateVideoUrl(
    @Body() videoUrlDto: GenerateVideoUrlDto,
  ): Promise<any> {
    const { videoId } = videoUrlDto;
    return await this.courseService.generateVideoUrl(videoId);
  }
}
