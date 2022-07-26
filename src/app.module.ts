import { Module } from '@nestjs/common';
import { LambdaService } from './lambda/lambda.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LambdaService],
})
export class AppModule {}
