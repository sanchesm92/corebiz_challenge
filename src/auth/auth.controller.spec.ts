import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/SigninDto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token and user info on successful authentication', async () => {
      const signInDto: SigninDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const result = {
        accessToken: 'valid.jwt.token',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await controller.signIn(signInDto)).toEqual(result);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const signInDto: SigninDto = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });
});
