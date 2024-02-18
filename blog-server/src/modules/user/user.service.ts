import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService:JwtService
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }
  async login({ name, password }: LoginUserDto) {
    console.log(name, password);
    
    const user = await this.userRepository.findOne({
      where:{
        name
      }
    });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        name,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
