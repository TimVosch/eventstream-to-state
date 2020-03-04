import {
  Controller,
  Get,
  NotImplementedException,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.service.getUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post('/')
  createUser(@Body() dto: CreateUserDTO) {
    return this.service.createUser(dto);
  }

  @Post('/:id/credit')
  async mutateCredit(@Param('id') id: string, @Body() body: any) {
    const user = await this.getUser(id);

    // Mutation must be numeric
    if (typeof body.amount !== 'number') {
      return new BadRequestException();
    }

    return this.service.mutateCredit(user.id, body.amount);
  }

  @Delete('/:id')
  deleteUser(@Param('id') userId: string) {
    return this.service.deleteUser(userId);
  }
}
