import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/SigninDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user and retrieve JWT token' })
  @ApiResponse({
    status: 200,
    description:
      'Authentication successful. Returns the JWT access token and user information.',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MjUzMjUwNzIsImV4cCI6MTYyNTMyODY3Mn0.qZ8cD1GjKvV8W3qWUvUHvXIg-dBB7XfhfDPFjEPPufM',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'eyJhbG$ciOiJIUzI1NiI$sInR5',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed. The provided credentials are invalid.',
  })
  @ApiBody({
    type: SigninDto,
    description: 'The email and password required for authentication.',
  })
  async signIn(@Body() signInDto: SigninDto) {
    try {
      const { accessToken, user } = await this.authService.signIn(signInDto);
      return { accessToken, user };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
