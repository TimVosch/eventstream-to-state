import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  async mutateCredit(@Param('id') userId: string, @Body() body: any) {
    // Mutation must be numeric
    if (typeof body.amount !== 'number') {
      return new BadRequestException();
    }

    return this.service.mutateCredit(userId, body.amount);
  }

  @Delete('/:id')
  deleteUser(@Param('id') userId: string) {
    return this.service.deleteUser(userId);
  }
}
