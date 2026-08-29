import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { StudentsService } from '../students/students.service';
import { PaymentsService } from '../payments/payments.service';
import { ExamsService } from '../exams/exams.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private studentsService: StudentsService,
    private paymentsService: PaymentsService,
    private examsService: ExamsService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('students')
  getStudents(@Query() query: { search?: string; status?: string; page?: string; limit?: string }) {
    return this.studentsService.findAll({
      search: query.search,
      status: query.status,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });
  }

  @Post('students')
  createStudent(@Body() body: { name: string; email?: string; programme?: string; level?: string }) {
    return this.studentsService.create(body);
  }

  @Patch('students/:id')
  updateStudent(
    @Param('id') id: string,
    @Body() body: { name?: string; status?: 'active' | 'inactive' | 'suspended' | 'graduated'; level?: string },
  ) {
    return this.studentsService.update(id, body);
  }

  @Get('payments')
  getPayments(@Query() query: { page?: string; limit?: string }) {
    return this.paymentsService.getAllPayments({
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 50,
    });
  }

  @Post('results/upload')
  uploadResults(@Body() body: { results: Array<{ schoolId: string; courseCode: string; score: number; semester: string; year: string }> }) {
    return this.adminService.uploadResults(body.results);
  }

  @Post('exams')
  createExam(@Body() body: {
    title: string;
    courseId?: string;
    startTime: string;
    endTime: string;
    duration: number;
    questions?: Array<{ text: string; type: string; options?: string[]; correctAnswer?: string }>;
  }) {
    return this.examsService.createExam({
      ...body,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    });
  }

  @Get('exams')
  getExams() {
    return this.examsService.getAllExams();
  }

  @Post('announcements')
  createAnnouncement(@Body() body: { title: string; body: string; target?: string }) {
    return this.adminService.createAnnouncement(body);
  }
}
