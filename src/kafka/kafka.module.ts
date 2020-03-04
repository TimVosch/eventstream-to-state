import { Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Module({
  providers: [
    {
      provide: 'KAFKA',
      useValue: new Kafka({
        clientId: 'NestJSClient',
        brokers: ['localhost:9092'],
      }),
    },
  ],
  exports: ['KAFKA'],
})
export class KafkaModule {}
