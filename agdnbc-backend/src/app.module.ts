import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { ExamsModule } from './exams/exams.module';
import { PaymentsModule } from './payments/payments.module';
import { ContentModule } from './content/content.module';
import { AlumniModule } from './alumni/alumni.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentsModule,
    ExamsModule,
    PaymentsModule,
    ContentModule,
    AlumniModule,
    AdminModule,
  ],
})
export class AppModule {}
