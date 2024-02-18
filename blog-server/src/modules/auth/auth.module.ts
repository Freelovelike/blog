import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'jwt',
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
