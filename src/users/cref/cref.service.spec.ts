import { Test, TestingModule } from '@nestjs/testing';
import { CrefService } from './cref.service';

describe('CrefService', () => {
  let service: CrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrefService],
    }).compile();

    service = module.get<CrefService>(CrefService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
