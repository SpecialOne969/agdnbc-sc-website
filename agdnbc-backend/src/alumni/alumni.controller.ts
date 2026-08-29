import { Controller, Post, Body } from '@nestjs/common';
import { AlumniService } from './alumni.service';

@Controller('alumni')
export class AlumniController {
  constructor(private alumniService: AlumniService) {}

  @Post('register')
  register(@Body() body: { fullName: string; email: string; phone?: string; graduationYear: string; programme: string; occupation?: string; location?: string }) {
    return this.alumniService.register(body);
  }
}
