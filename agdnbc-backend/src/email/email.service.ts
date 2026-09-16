import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly adminEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM_EMAIL || 'AGDNBC <onboarding@resend.dev>';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@agdnbc-sc.edu.ng';
  }

  async sendPaymentClaimNotification(claim: {
    studentName: string;
    studentId: string;
    category: string;
    amount: number;
    transactionRef: string;
    submittedAt: string;
  }) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.adminEmail,
        subject: `New Payment Claim — ${claim.studentName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0f3460;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">AGDNBC Payment Claim</h1>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
              <p style="color:#374151;margin-top:0">A student has submitted a bank transfer payment claim.</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;color:#6b7280;font-size:14px">Student</td><td style="padding:8px;font-weight:600">${claim.studentName}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">School ID</td><td style="padding:8px;font-weight:600">${claim.studentId}</td></tr>
                <tr><td style="padding:8px;color:#6b7280;font-size:14px">Category</td><td style="padding:8px;font-weight:600">${claim.category}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">Amount</td><td style="padding:8px;font-weight:600;color:#0f3460">₦${claim.amount.toLocaleString()}</td></tr>
                <tr><td style="padding:8px;color:#6b7280;font-size:14px">Transaction Ref</td><td style="padding:8px;font-family:monospace;font-weight:600">${claim.transactionRef}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">Submitted</td><td style="padding:8px;font-size:14px">${claim.submittedAt}</td></tr>
              </table>
              <div style="margin-top:24px;padding:16px;background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b">
                <p style="margin:0;font-size:14px;color:#92400e">Please verify this transaction on your bank app or internet banking before approving. Log in to the admin panel to approve or reject.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send payment claim notification', err);
    }
  }

  async sendClaimApproved(to: string, studentName: string, category: string, amount: number) {
    if (!to) return;
    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Payment Approved — AGDNBC',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0f3460;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Payment Approved ✓</h1>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
              <p style="color:#374151">Dear <strong>${studentName}</strong>,</p>
              <p style="color:#374151">Your payment claim has been <strong style="color:#16a34a">approved</strong> by the admin.</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;color:#6b7280;font-size:14px">Category</td><td style="padding:8px;font-weight:600">${category}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">Amount</td><td style="padding:8px;font-weight:600;color:#0f3460">₦${amount.toLocaleString()}</td></tr>
              </table>
              <p style="color:#374151;margin-top:16px">You can now access all features of your student portal. Thank you for completing your payment.</p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send approval email', err);
    }
  }

  async sendClaimRejected(to: string, studentName: string, category: string, adminNote?: string) {
    if (!to) return;
    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Payment Claim Update — AGDNBC',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0f3460;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Payment Claim Update</h1>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
              <p style="color:#374151">Dear <strong>${studentName}</strong>,</p>
              <p style="color:#374151">Unfortunately your payment claim for <strong>${category}</strong> could not be verified and has been <strong style="color:#dc2626">rejected</strong>.</p>
              ${adminNote ? `<div style="padding:16px;background:#fef2f2;border-radius:8px;border-left:4px solid #dc2626;margin:16px 0"><p style="margin:0;font-size:14px;color:#991b1b"><strong>Reason:</strong> ${adminNote}</p></div>` : ''}
              <p style="color:#374151">Please contact the registrar's office or resubmit with the correct transaction reference.</p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send rejection email', err);
    }
  }
}
