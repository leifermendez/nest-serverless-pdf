import { Test, TestingModule } from '@nestjs/testing';
import { NotLambdaService } from './not-lambda.service';

describe('NotLambdaService', () => {
  let service: NotLambdaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotLambdaService],
    }).compile();

    service = module.get<NotLambdaService>(NotLambdaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
