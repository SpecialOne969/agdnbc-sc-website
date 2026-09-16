import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';

class InitializePaymentDto {
  @IsString() category: string;
  @IsNumber() amount: number;
}

class SubmitClaimDto {
  @IsString() category: string;
  @IsNumber() @Min(1) amount: number;
  @IsString() transactionRef: string;
}

class ReviewClaimDto {
  @IsOptional() @IsString() adminNote?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  async initialize(
    @CurrentUser() user: { id: string; email?: string; schoolId?: string },
    @Body() body: InitializePaymentDto,
  ) {
    const email = user.email || `${user.schoolId}@agdnbcsc.edu.ng`;
    return this.paymentsService.initializePayment(user.id, body.category, body.amount, email);
  }

  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard)
  verify(@Param('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Post('webhook')
  webhook(@Body() body: { event: string; data: { reference: string } }) {
    return this.paymentsService.handleWebhook(body);
  }

  // ─── Payment Claims (student endpoints) ───────────────────────────────────

  @Post('claims')
  @UseGuards(JwtAuthGuard)
  submitClaim(
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitClaimDto,
  ) {
    return this.paymentsService.submitClaim(user.id, dto);
  }

  @Get('claims/mine')
  @UseGuards(JwtAuthGuard)
  myClaims(@CurrentUser() user: { id: string }) {
    return this.paymentsService.getStudentClaims(user.id);
  }

  // ─── Payment Claims (admin endpoints) ─────────────────────────────────────

  @Get('claims')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  getAllClaims() {
    return this.paymentsService.getAllClaims();
  }

  @Patch('claims/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  approveClaim(@Param('id') id: string, @Body() dto: ReviewClaimDto) {
    return this.paymentsService.approveClaim(id, dto.adminNote);
  }

  @Patch('claims/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  rejectClaim(@Param('id') id: string, @Body() dto: ReviewClaimDto) {
    return this.paymentsService.rejectClaim(id, dto.adminNote);
  }
}
