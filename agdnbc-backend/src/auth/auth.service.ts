import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async studentLogin(schoolId: string, password: string) {
    const student = await this.prisma.student.findUnique({ where: { schoolId } });
    if (!student) throw new UnauthorizedException('Invalid school ID or password');

    const valid = await bcrypt.compare(password, student.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid school ID or password');

    if (student.status !== 'active') {
      throw new ForbiddenException('Your account is currently inactive. Contact the registrar.');
    }

    const portalAccessValid = student.portalAccessExpiry
      ? student.portalAccessExpiry > new Date()
      : false;

    const payload = {
      sub: student.id,
      schoolId: student.schoolId,
      role: 'student',
    };

    return {
      token: this.jwt.sign(payload),
      user: {
        id: student.id,
        schoolId: student.schoolId,
        name: student.name,
        role: 'student',
        programme: student.programme,
        level: student.level,
        portalAccessValid,
        firstLogin: student.firstLogin,
      },
    };
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: admin.id, email: admin.email, role: admin.role };

    return {
      token: this.jwt.sign(payload),
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
