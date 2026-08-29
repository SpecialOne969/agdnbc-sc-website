import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalStudents, activeStudents, totalPayments, pendingPayments, activeExams] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: 'active' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
      this.prisma.payment.count({ where: { status: 'pending' } }),
      this.prisma.exam.count({ where: { status: 'active' } }),
    ]);

    return {
      totalStudents,
      activeStudents,
      totalRevenue: totalPayments._sum.amount || 0,
      pendingPayments,
      activeExams,
    };
  }

  async uploadResults(results: Array<{ schoolId: string; courseCode: string; score: number; semester: string; year: string }>) {
    const processed: string[] = [];
    for (const r of results) {
      const student = await this.prisma.student.findUnique({ where: { schoolId: r.schoolId } });
      const course = await this.prisma.course.findUnique({ where: { code: r.courseCode } });
      if (!student || !course) continue;

      const grade = r.score >= 70 ? 'A' : r.score >= 60 ? 'B' : r.score >= 50 ? 'C' : r.score >= 40 ? 'D' : 'F';

      await this.prisma.result.upsert({
        where: { studentId_courseId_semester_year: { studentId: student.id, courseId: course.id, semester: r.semester, year: r.year } },
        create: { studentId: student.id, courseId: course.id, score: r.score, grade, semester: r.semester, year: r.year },
        update: { score: r.score, grade },
      });
      processed.push(r.schoolId);
    }
    return { processed: processed.length };
  }

  async createAnnouncement(data: { title: string; body: string; target?: string }) {
    return this.prisma.announcement.create({ data });
  }
}
