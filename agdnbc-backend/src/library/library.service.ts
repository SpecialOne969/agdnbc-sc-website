import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type BookInput = {
  title?: string;
  description?: string;
  section?: string;
  pdfUrl?: string;
  available?: boolean;
};

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  // Students see only available books.
  findAvailable() {
    return this.prisma.libraryBook.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admins see everything.
  findAll() {
    return this.prisma.libraryBook.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: BookInput & { title: string; pdfUrl: string }) {
    return this.prisma.libraryBook.create({ data });
  }

  async update(id: string, data: BookInput) {
    await this.ensureExists(id);
    return this.prisma.libraryBook.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.libraryBook.delete({ where: { id } });
    return { id };
  }

  private async ensureExists(id: string) {
    const book = await this.prisma.libraryBook.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
  }
}
