import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;
  let prismaServiceMock: {
    user: {
      create: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      user: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockedHashedPassword =
        '$2a$10$EG7qtl2SJEboic.apJoJyeEkxsmvMuVr84E4Qrst3KVcjTx5zdcIW';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockedHashedPassword);

      const createdUser = {
        id: 1,
        ...createUserDto,
        password: mockedHashedPassword,
      };

      prismaServiceMock.user.create.mockResolvedValue(createdUser);

      expect(await controller.create(createUserDto)).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: mockedHashedPassword },
      });
    });
  });
});
