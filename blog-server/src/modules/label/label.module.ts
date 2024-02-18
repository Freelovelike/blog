import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from 'src/entity/label.entity';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';

@Module({
  imports:[TypeOrmModule.forFeature([Label])],
  controllers: [LabelController],
  providers: [LabelService],
})
export class LabelModule {}
