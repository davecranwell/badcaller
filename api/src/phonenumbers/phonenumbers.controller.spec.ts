import { Test, TestingModule } from '@nestjs/testing';
import { PhonenumbersController } from './phonenumbers.controller';
import { PhonenumbersService } from './phonenumbers.service';

describe('PhonenumbersController', () => {
  let controller: PhonenumbersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhonenumbersController],
      providers: [PhonenumbersService],
    }).compile();

    controller = module.get<PhonenumbersController>(PhonenumbersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
