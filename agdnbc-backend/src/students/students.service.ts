import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // School IDs follow AGDNBCSC/<year>/<NNN><campus>, e.g. AGDNBCSC/2026/001PH.
  // Numbering is per-session-year and per-campus (next available).
  private async generateSchoolId(year: string, campus: 'PH' | 'BY'): Promise<string> {
    const prefix = `AGDNBCSC/${year}/`;
    const existing = await this.prisma.student.findMany({
      where: { schoolId: { startsWith: prefix } },
      select: { schoolId: true },
    });

    let max = 0;
    for (const s of existing) {
      const suffix = s.schoolId.slice(prefix.length); // e.g. "031PH"
      if (suffix.endsWith(campus)) {
        const num = parseInt(suffix.slice(0, suffix.length - campus.length), 10);
        if (!Number.isNaN(num) && num > max) max = num;
      }
    }

    return `${prefix}${String(max + 1).padStart(3, '0')}${campus}`;
  }

  async create(data: {
    name: string;
    email?: string;
    programme?: string;
    level?: string;
    year?: string;
    campus?: string;
  }) {
    const year = data.year && /^\d{4}$/.test(data.year) ? data.year : String(new Date().getFullYear());
    const campus: 'PH' | 'BY' = data.campus === 'BY' ? 'BY' : 'PH';

    const existing = data.email
      ? await this.prisma.student.findUnique({ where: { email: data.email } })
      : null;
    if (existing) throw new ConflictException('Email already exists');

    const schoolId = await this.generateSchoolId(year, campus);
    const defaultPassword = 'agdnbc1';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    // Portal access is intentionally left unset — it unlocks only when
    // School Fees are paid/verified (see PaymentsService.verifyPayment).
    const student = await this.prisma.student.create({
      data: {
        schoolId,
        name: data.name,
        email: data.email,
        programme: data.programme || 'Biblical Studies',
        level: data.level || 'Year 1',
        admissionYear: year,
        session: `${year}/${Number(year) + 1}`,
        status: 'active',
        firstLogin: true,
        passwordHash,
      },
    });

    return { student, defaultPassword };
  }

  async findAll(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const { search, status, page = 1, limit = 20 } = params || {};
    const where = {
      ...(status ? { status: status as 'active' | 'inactive' | 'suspended' | 'graduated' } : {}),
      ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { schoolId: { contains: search } }] } : {}),
    };
    const [students, total] = await Promise.all([
      this.prisma.student.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.student.count({ where }),
    ]);
    return { students, total, page, limit };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findBySchoolId(schoolId: string) {
    const student = await this.prisma.student.findUnique({ where: { schoolId } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, data: Partial<{ name: string; phone: string; address: string; level: string; status: 'active' | 'inactive' | 'suspended' | 'graduated' }>) {
    return this.prisma.student.update({ where: { id }, data });
  }

  async updatePassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    return this.prisma.student.update({ where: { id }, data: { passwordHash, firstLogin: false } });
  }

  async grantPortalAccess(studentId: string) {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    return this.prisma.student.update({
      where: { id: studentId },
      data: { portalAccessExpiry: expiry },
    });
  }

  async getMyCourses(studentId: string) {
    return this.prisma.studentCourse.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyResults(studentId: string) {
    const results = await this.prisma.result.findMany({
      where: { studentId, published: true },
      include: { course: true },
      orderBy: { semester: 'asc' },
    });

    const grouped: Record<string, typeof results> = {};
    for (const r of results) {
      const key = `${r.semester} ${r.year}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }

    return Object.entries(grouped).map(([semester, courses]) => ({
      semester,
      courses: courses.map((r) => ({
        code: r.course.code,
        name: r.course.name,
        score: r.score,
        grade: r.grade,
        status: r.score >= 40 ? 'Pass' : 'Fail',
      })),
    }));
  }

  async getMyPayments(studentId: string) {
    return this.prisma.payment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyAnnouncements() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
