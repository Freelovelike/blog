import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from 'src/entity/gallery.entity';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports:[TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleryController],
  providers: [GalleryService]
})
export class GalleryModule {}
