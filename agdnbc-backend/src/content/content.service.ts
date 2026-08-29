import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  getNews() {
    return this.prisma.newsPost.findMany({ orderBy: { publishedAt: 'desc' }, take: 20 });
  }

  getEvents() {
    return this.prisma.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' } });
  }

  getTeam() {
    return this.prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  }

  getProgrammes() {
    return this.prisma.programme.findMany({ include: { courses: true } });
  }

  async createContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string; type?: string }) {
    return this.prisma.contactMessage.create({ data });
  }

  async createNewsPost(data: { title: string; body: string; category?: string; imageUrl?: string; adminId?: string }) {
    return this.prisma.newsPost.create({ data });
  }

  async createAnnouncement(data: { title: string; body: string; target?: string; adminId?: string }) {
    return this.prisma.announcement.create({ data });
  }

  async createEvent(data: { title: string; description?: string; date: Date; location?: string }) {
    return this.prisma.event.create({ data });
  }
}
