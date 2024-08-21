import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description:
      "The email address associated with the user's account. This is used for authentication during the sign-in process.",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      "The user's account password. Ensure that it is at least 6 characters long and matches the password used during registration.",
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
