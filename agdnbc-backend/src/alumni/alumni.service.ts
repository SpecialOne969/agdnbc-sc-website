import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlumniService {
  constructor(private prisma: PrismaService) {}

  register(data: { fullName: string; email: string; phone?: string; graduationYear: string; programme: string; occupation?: string; location?: string }) {
    return this.prisma.alumni.create({ data });
  }

  findAll() {
    return this.prisma.alumni.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
