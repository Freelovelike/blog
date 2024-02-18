import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { LabelModule } from './modules/label/label.module';
import { UserModule } from './modules/user/user.module';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env.${process.env.NODE_ENV}`],
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: 'blog',
      entities: [__dirname + './entity/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),

    ArticleModule,
    LabelModule,
    UserModule,
    CategoryModule,
    AuthModule,
    GalleryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
