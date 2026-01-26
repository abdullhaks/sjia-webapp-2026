import { Test, TestingModule } from '@nestjs/testing';
import { ContentManagementController } from './content-management.controller';

describe('ContentManagementController', () => {
  let controller: ContentManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentManagementController],
    }).compile();

    controller = module.get<ContentManagementController>(ContentManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
