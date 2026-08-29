import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'agdnbc-secret-key',
    });
  }

  async validate(payload: { sub: string; role: string; schoolId?: string }) {
    if (payload.role === 'student') {
      const student = await this.prisma.student.findUnique({ where: { id: payload.sub } });
      if (!student || student.status !== 'active') throw new UnauthorizedException();
      return { id: student.id, schoolId: student.schoolId, role: 'student', name: student.name };
    }

    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin) throw new UnauthorizedException();
    return { id: admin.id, email: admin.email, role: admin.role, name: admin.name };
  }
}
