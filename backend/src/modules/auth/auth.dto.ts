import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 注册请求体 */
export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @Length(2, 64)
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @Length(6, 128)
  password: string;
}

/** 登录请求体 */
export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @Length(6, 128)
  password: string;
}
