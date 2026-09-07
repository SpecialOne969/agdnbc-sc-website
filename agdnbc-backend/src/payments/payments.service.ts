import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class PaymentsService {
  private readonly paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  private readonly paystackBase = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async initializePayment(studentId: string, category: string, amount: number, email: string) {
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    await this.prisma.payment.create({
      data: { studentId, category, amount, reference, status: 'pending' },
    });

    const response = await axios.post(
      `${this.paystackBase}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
        reference,
        callback_url: `${process.env.FRONTEND_URL}/portal/payments?verify=true`,
        metadata: { studentId, category },
      },
      { headers: { Authorization: `Bearer ${this.paystackSecret}` } },
    );

    return response.data.data;
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${this.paystackBase}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${this.paystackSecret}` } },
    );

    const data = response.data.data;
    if (data.status !== 'success') throw new BadRequestException('Payment verification failed');

    const payment = await this.prisma.payment.update({
      where: { reference },
      data: { status: 'paid', paystackId: data.id.toString() },
    });

    // Grant portal access when school fees are paid (portal is included in school fees)
    const schoolFeeCategories = ['School Fees (Year 1)', 'School Fees (Year 2)'];
    if (schoolFeeCategories.includes(payment.category)) {
      await this.studentsService.grantPortalAccess(payment.studentId);
    }

    return payment;
  }

  async handleWebhook(event: { event: string; data: { reference: string } }) {
    if (event.event === 'charge.success') {
      await this.verifyPayment(event.data.reference).catch(() => null);
    }
  }

  async getStudentPayments(studentId: string) {
    return this.prisma.payment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPayments(params?: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = params || {};
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        include: { student: { select: { name: true, schoolId: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count(),
    ]);
    return { payments, total };
  }
}
