import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

/**
 * 用户控制器
 * 提供用户 CRUD 接口
 */
@ApiTags('用户')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return ApiResponseDto.created(user);
  }

  @ApiOperation({ summary: '查询所有用户' })
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return ApiResponseDto.ok(users);
  }

  @ApiOperation({ summary: '查询单个用户' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return ApiResponseDto.ok(user);
  }

  @ApiOperation({ summary: '更新用户' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return ApiResponseDto.ok(user);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return ApiResponseDto.ok(null, '删除成功');
  }
}
