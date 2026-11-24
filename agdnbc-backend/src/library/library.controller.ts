import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@Controller('library')
export class LibraryController {
  constructor(private library: LibraryService) {}

  // Any authenticated user (students) — available books only.
  @Get('books')
  @UseGuards(JwtAuthGuard)
  getBooks() {
    return this.library.findAvailable();
  }

  // ── Admin management ──────────────────────────────────────────────────────
  @Get('admin/books')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  getAllBooks() {
    return this.library.findAll();
  }

  @Post('admin/books')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  create(
    @Body()
    body: {
      title: string;
      description?: string;
      section?: string;
      pdfUrl: string;
      available?: boolean;
    },
  ) {
    return this.library.create(body);
  }

  @Patch('admin/books/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.library.update(id, body);
  }

  @Delete('admin/books/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  remove(@Param('id') id: string) {
    return this.library.remove(id);
  }
}
