import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('news')
  getNews() { return this.contentService.getNews(); }

  @Get('events')
  getEvents() { return this.contentService.getEvents(); }

  @Get('team')
  getTeam() { return this.contentService.getTeam(); }

  @Get('programmes')
  getProgrammes() { return this.contentService.getProgrammes(); }

  @Post('contact')
  contact(@Body() body: { name: string; email: string; phone?: string; subject: string; message: string; type?: string }) {
    return this.contentService.createContactMessage(body);
  }
}
