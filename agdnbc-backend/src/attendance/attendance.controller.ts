import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

// Generic Firestore-compatible document API backing the self-hosted attendance app.
// Admin-only — mirrors the access level of the original Firebase-authenticated panel.
@Controller('attendance-data')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AttendanceController {
  constructor(private attendance: AttendanceService) {}

  @Get(':collection')
  list(@Param('collection') collection: string) {
    return this.attendance.list(collection);
  }

  @Post(':collection')
  create(
    @Param('collection') collection: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.attendance.create(collection, body);
  }

  @Get(':collection/:id')
  get(@Param('collection') collection: string, @Param('id') id: string) {
    return this.attendance.get(collection, id);
  }

  @Put(':collection/:id')
  set(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.attendance.set(collection, id, body);
  }

  @Patch(':collection/:id')
  update(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.attendance.update(collection, id, body);
  }

  @Delete(':collection/:id')
  remove(@Param('collection') collection: string, @Param('id') id: string) {
    return this.attendance.remove(collection, id);
  }
}
