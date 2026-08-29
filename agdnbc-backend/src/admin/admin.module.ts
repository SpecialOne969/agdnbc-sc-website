import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { StudentsModule } from '../students/students.module';
import { PaymentsModule } from '../payments/payments.module';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [StudentsModule, PaymentsModule, ExamsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
