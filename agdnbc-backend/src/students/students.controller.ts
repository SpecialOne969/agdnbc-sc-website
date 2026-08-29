import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: { id: string }) {
    return this.studentsService.findOne(user.id);
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() user: { id: string },
    @Body() body: { phone?: string; address?: string },
  ) {
    return this.studentsService.update(user.id, body);
  }

  @Get('me/courses')
  async getMyCourses(@CurrentUser() user: { id: string }) {
    return this.studentsService.getMyCourses(user.id);
  }

  @Get('me/results')
  async getMyResults(@CurrentUser() user: { id: string }) {
    return this.studentsService.getMyResults(user.id);
  }

  @Get('me/payments')
  async getMyPayments(@CurrentUser() user: { id: string }) {
    return this.studentsService.getMyPayments(user.id);
  }

  @Get('me/announcements')
  async getMyAnnouncements(@Request() req: { user: unknown }) {
    return this.studentsService.getMyAnnouncements();
  }
}
