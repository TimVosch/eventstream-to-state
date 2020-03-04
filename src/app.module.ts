import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [KafkaModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
