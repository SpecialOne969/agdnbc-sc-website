import { Controller, Post, Body } from '@nestjs/common';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class StudentLoginDto {
  @IsString()
  schoolId: string;

  // Accept whatever length the student's stored password is (no fixed cap).
  @IsString()
  password: string;
}

class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('student/login')
  studentLogin(@Body() dto: StudentLoginDto) {
    return this.authService.studentLogin(dto.schoolId, dto.password);
  }

  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.email, dto.password);
  }
}
