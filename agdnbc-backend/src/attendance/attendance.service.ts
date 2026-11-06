import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Firestore-style collections the attendance app uses. Anything else is rejected.
const ALLOWED_COLLECTIONS = ['students', 'courses', 'attendance'];

type DocData = Record<string, unknown>;

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private assertCollection(collection: string) {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      throw new BadRequestException(`Unknown collection: ${collection}`);
    }
  }

  // Returns every doc in a collection as { id, data } — the shim filters/sorts client-side.
  async list(collection: string) {
    this.assertCollection(collection);
    const docs = await this.prisma.attendanceDocument.findMany({
      where: { collection },
      orderBy: { createdAt: 'asc' },
    });
    return docs.map((d) => ({ id: d.id, data: d.data }));
  }

  async get(collection: string, id: string) {
    this.assertCollection(collection);
    const doc = await this.prisma.attendanceDocument.findFirst({
      where: { id, collection },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return { id: doc.id, data: doc.data };
  }

  async create(collection: string, data: DocData) {
    this.assertCollection(collection);
    const doc = await this.prisma.attendanceDocument.create({
      data: { collection, data: (data ?? {}) as Prisma.InputJsonValue },
    });
    return { id: doc.id, data: doc.data };
  }

  // Firestore .set() — replace the document's data entirely (upsert on id).
  async set(collection: string, id: string, data: DocData) {
    this.assertCollection(collection);
    const doc = await this.prisma.attendanceDocument.upsert({
      where: { id },
      create: { id, collection, data: (data ?? {}) as Prisma.InputJsonValue },
      update: { data: (data ?? {}) as Prisma.InputJsonValue },
    });
    return { id: doc.id, data: doc.data };
  }

  // Firestore .update() — shallow-merge into existing data.
  async update(collection: string, id: string, data: DocData) {
    this.assertCollection(collection);
    const existing = await this.prisma.attendanceDocument.findFirst({
      where: { id, collection },
    });
    if (!existing) throw new NotFoundException('Document not found');
    const merged = { ...(existing.data as DocData), ...(data ?? {}) };
    const doc = await this.prisma.attendanceDocument.update({
      where: { id },
      data: { data: merged as Prisma.InputJsonValue },
    });
    return { id: doc.id, data: doc.data };
  }

  async remove(collection: string, id: string) {
    this.assertCollection(collection);
    await this.prisma.attendanceDocument.deleteMany({ where: { id, collection } });
    return { id };
  }
}
