import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
