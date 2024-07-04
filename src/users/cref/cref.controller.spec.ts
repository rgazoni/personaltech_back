import { Test, TestingModule } from '@nestjs/testing';
import { CrefController } from './cref.controller';

describe('CrefController', () => {
  let controller: CrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrefController],
    }).compile();

    controller = module.get<CrefController>(CrefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
