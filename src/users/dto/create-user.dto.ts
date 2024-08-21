import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description:
      "The full name of the user. This should be the user's real name or a display name they prefer to be identified by.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description:
      "The user's email address. This will be used for account verification and login purposes.",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      "A strong password for the user's account. The password must be at least 6 characters long.",
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
