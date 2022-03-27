import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
      create: jest.fn(user => {
          return {
              id: Date.now(),
              ...user
          }
      })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sloud create a user' () => {
     expect(controller.create({name: 'Muryel'})).toEqual({
         id: expect.any(Number),
         name: 'Muryel'
     })
  })
});
