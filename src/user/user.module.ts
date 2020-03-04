import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSource } from './user.source';

@Module({
  imports: [KafkaModule],
  controllers: [UserController],
  providers: [UserService, UserSource],
})
export class UserModule {}
