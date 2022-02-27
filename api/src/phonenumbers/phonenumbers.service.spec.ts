import { Test, TestingModule } from '@nestjs/testing';
import { PhonenumbersService } from './phonenumbers.service';

describe('PhonenumbersService', () => {
  let service: PhonenumbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhonenumbersService],
    }).compile();

    service = module.get<PhonenumbersService>(PhonenumbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
