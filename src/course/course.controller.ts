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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenerateVideoUrlDto } from './dto/generate-videourl.dto';

@Controller('courses')
@ApiTags('courses')
@ApiBearerAuth('JWT-auth')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    type: CourseEntity,
  })
  @ApiOperation({
    summary: 'Create a new Course',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async uploadCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return await this.courseService.uploadCourse(createCourseDto);
  }

  @UseGuards(AdminAuthGuard)
  @Put('edit/:id')
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @ApiOperation({
    summary: 'Edit an existing Course',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async editCourse(
    @Body() editCourseDto: EditCourseDto,
    @Param('id') id: string,
  ): Promise<CourseEntity> {
    return await this.courseService.editCourse(id, editCourseDto);
  }

  @Get('for-all/:id')
  @ApiOperation({
    summary: 'Get a Course for all users',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  async getCourseForAllUsers(@Param('id') id: string): Promise<CourseEntity> {
    return await this.courseService.getCourseForAll(id);
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: [CourseEntity],
  })
  @ApiOperation({
    summary: 'Get all Courses',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async getAllCourses(): Promise<CourseEntity[]> {
    return await this.courseService.allCourses();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('ca/:id')
  @ApiOperation({ summary: 'Get a Paid Course for a user' })
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async findCourseById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.getCourse(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('q/add')
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  @ApiOperation({ summary: 'Add a new question to a course' })
  async addQuestion(
    @Body() questionDto: QuestionDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.addQuestion(questionDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Reply to a question',
    description: 'Reply to a question posted by a user',
  })
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  @Put('q/reply')
  async replyQuestion(
    @Body() questionReplyDto: QuestionReplyDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.courseService.replyQuestion(questionReplyDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('review/add/:id')
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @ApiOperation({
    summary: 'Add a new review to a course',
    description: 'Add a new review to a course',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async addReview(
    @Body() reviewDto: AddReviewDTO,
    @GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<Message> {
    return await this.courseService.addReview(user, reviewDto, id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('review/reply/:id')
  @ApiResponse({
    status: 200,
    type: Promise<Message>,
  })
  @ApiOperation({
    summary: 'Reply to a review',
    description: 'Reply to a review posted by a user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  async editReview(
    @Body() reviewReplyDto: ReviewReplyDto,
    @GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<Message> {
    return await this.courseService.addReplyToReview(user, reviewReplyDto, id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiResponse({
    status: 200,
    type: [CourseEntity],
  })
  @ApiOperation({
    summary: 'Delete a review',
    description: 'Delete a review posted by a user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  @Get('all-courses/')
  async allCourses(): Promise<Message> {
    return await this.courseService.getAllCourses();
  }

  // delete course
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Delete a course',
    description: 'Delete a course',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    status: 500,
  })
  @ApiResponse({
    status: 200,
    type: CourseEntity,
  })
  @Delete('delete/:id')
  async deleteCourse(@Param('id') id: string): Promise<Message> {
    return await this.courseService.deleteCourse(id);
  }

  @Post('generate-videoUrl')
  @ApiOperation({
    summary: 'Generate a video URL',
    description: 'Generate a video URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async generateVideoUrl(
    @Body() videoUrlDto: GenerateVideoUrlDto,
  ): Promise<any> {
    const { videoId } = videoUrlDto;
    return await this.courseService.generateVideoUrl(videoId);
  }
}
