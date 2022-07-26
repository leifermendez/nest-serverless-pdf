import { Test, TestingModule } from '@nestjs/testing';
import { LambdaService } from './lambda.service';

describe('LambdaService', () => {
  let service: LambdaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LambdaService],
    }).compile();

    service = module.get<LambdaService>(LambdaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
