import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { generateId } from '../../shared/utils/id-generator';

/** JWT payload 结构 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  username: string;
}

/**
 * 认证服务
 * 负责注册、登录、token 签发
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /** 注册 */
  async register(dto: RegisterDto): Promise<{ token: string }> {
    const exists = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      id: generateId(),
      username: dto.username,
      email: dto.email,
      password: hashed,
    });
    await this.userRepo.save(user);
    this.logger.log(`用户注册成功: ${user.id}`);

    return { token: this.signToken(user) };
  }

  /** 登录 */
  async login(dto: LoginDto): Promise<{ token: string }> {
    // select: false 的字段需要显式 addSelect
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    this.logger.log(`用户登录成功: ${user.id}`);
    return { token: this.signToken(user) };
  }

  /** 签发 JWT */
  private signToken(user: UserEntity): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
