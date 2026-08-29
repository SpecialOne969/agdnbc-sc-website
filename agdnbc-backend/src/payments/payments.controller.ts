import { Controller, Post, Get, Body, Param, UseGuards, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  async initialize(
    @CurrentUser() user: { id: string; email?: string; schoolId?: string },
    @Body() body: { category: string; amount: number },
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
}
