import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class PaymentsService {
  private readonly paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  private readonly paystackBase = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
    private emailService: EmailService,
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

    if (payment.category.startsWith('School Fees')) {
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

  // ─── Payment Claims (Bank Transfer) ────────────────────────────────────────

  async submitClaim(studentId: string, dto: { category: string; amount: number; transactionRef: string }) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: { name: true, schoolId: true, email: true },
    });
    if (!student) throw new NotFoundException('Student not found');

    const claim = await this.prisma.paymentClaim.create({
      data: {
        studentId,
        studentName: student.name,
        category: dto.category,
        amount: dto.amount,
        transactionRef: dto.transactionRef,
      },
    });

    await this.emailService.sendPaymentClaimNotification({
      studentName: student.name,
      studentId: student.schoolId,
      category: dto.category,
      amount: dto.amount,
      transactionRef: dto.transactionRef,
      submittedAt: new Date(claim.submittedAt).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
    });

    return claim;
  }

  async getStudentClaims(studentId: string) {
    return this.prisma.paymentClaim.findMany({
      where: { studentId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getAllClaims() {
    return this.prisma.paymentClaim.findMany({
      include: { student: { select: { name: true, schoolId: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async approveClaim(id: string, adminNote?: string) {
    const claim = await this.prisma.paymentClaim.findUnique({
      where: { id },
      include: { student: { select: { email: true, name: true } } },
    });
    if (!claim) throw new NotFoundException('Claim not found');

    const updated = await this.prisma.paymentClaim.update({
      where: { id },
      data: { status: 'approved', adminNote: adminNote || null },
    });

    await this.emailService.sendClaimApproved(
      claim.student.email || '',
      claim.student.name,
      claim.category,
      claim.amount,
    );

    return updated;
  }

  async rejectClaim(id: string, adminNote?: string) {
    const claim = await this.prisma.paymentClaim.findUnique({
      where: { id },
      include: { student: { select: { email: true, name: true } } },
    });
    if (!claim) throw new NotFoundException('Claim not found');

    const updated = await this.prisma.paymentClaim.update({
      where: { id },
      data: { status: 'rejected', adminNote: adminNote || null },
    });

    await this.emailService.sendClaimRejected(
      claim.student.email || '',
      claim.student.name,
      claim.category,
      adminNote,
    );

    return updated;
  }
}
