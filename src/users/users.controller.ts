import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('auth-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new user',
    description:
      "This endpoint allows you to create a new user account. The user's information, including name, email, and password, must be provided in the request body.",
  })
  @ApiResponse({
    status: 201,
    description:
      'The user account has been successfully created and stored in the database.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data. Please ensure all required fields are correctly filled out.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
