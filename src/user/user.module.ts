import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserQuery } from './cqrs/user.query';
import { UserCommand } from './cqrs/user.command';
import { UserMemory } from './cqrs/user.memory';

@Module({
  imports: [KafkaModule],
  controllers: [UserController],
  providers: [UserService, UserMemory, UserQuery, UserCommand],
})
export class UserModule {}
