import {
  Controller,
  Get,
  NotImplementedException,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/:id')
  getUser(): User {
    throw new NotImplementedException();
  }

  @Post('/')
  createUser(@Body() dto: CreateUserDTO): Promise<User> {
    return this.service.createUser(dto);
  }

  @Patch('/')
  updateUser(): User {
    throw new NotImplementedException();
  }

  @Delete('/:id')
  deleteUser(): User {
    throw new NotImplementedException();
  }
}
