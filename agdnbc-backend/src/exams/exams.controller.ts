import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { RolesGuard } from '../common/guards';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Get('my')
  getMyExams(@CurrentUser() user: { id: string }) {
    return this.examsService.getStudentExams(user.id);
  }

  @Get(':id')
  getExam(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.examsService.getExamForStudent(id, user.id);
  }

  @Post(':id/submit')
  submitExam(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() body: { answers: Record<string, string> },
  ) {
    return this.examsService.submitExam(id, user.id, body.answers);
  }
}
