import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('partnerships')
export class PartnershipsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  create(@Body() body: {
    name: string;
    email: string;
    phone?: string;
    organisation?: string;
    partnershipType: string;
    intendedAmount?: string;
    message?: string;
  }) {
    return this.prisma.partnershipForm.create({ data: body });
  }
}
