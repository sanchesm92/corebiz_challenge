import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/SigninDto';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      const signInDto: SigninDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const signInDto: SigninDto = {
        email: 'john.doe@example.com',
        password: 'invalidpassword',
      };

      const user = {
        id: 1,
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should return accessToken and user if credentials are valid', async () => {
      const signInDto: SigninDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
      };

      const accessToken = 'valid.jwt.token';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue(accessToken);

      const result = await authService.signIn(signInDto);

      expect(result).toEqual({ accessToken, user });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        userId: user.id,
      });
    });
  });
});
