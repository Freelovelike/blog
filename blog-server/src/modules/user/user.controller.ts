import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags("用户接口")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Public()
  @Post('login')
  findOne(@Body()  user:LoginUserDto) {
    console.log({user});
    
    return this.userService.login(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
