import { Module } from '@nestjs/common';
import { AlumniController } from './alumni.controller';
import { AlumniService } from './alumni.service';
import { PartnershipsController } from './partnerships.controller';

@Module({ controllers: [AlumniController, PartnershipsController], providers: [AlumniService] })
export class AlumniModule {}
