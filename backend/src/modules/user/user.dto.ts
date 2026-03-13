import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 创建用户请求体 */
export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: '用户名' })
  @IsString()
  @Length(2, 64)
  username: string;

  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsEmail()
  email: string;
}

/** 更新用户请求体 */
export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: '用户名', required: false })
  @IsString()
  @Length(2, 64)
  username?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: '邮箱',
    required: false,
  })
  @IsEmail()
  email?: string;
}
