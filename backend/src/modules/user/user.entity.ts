import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { generateId } from '../../shared/utils/id-generator';

/**
 * 用户实体
 */
@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: 'UUIDv7 主键' })
  id: string;

  @Column({ unique: true, length: 64, comment: '用户名' })
  username: string;

  @Column({ unique: true, length: 128, comment: '邮箱' })
  email: string;

  @Column({ length: 128, comment: '密码（bcrypt 哈希）', select: false })
  password: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  /** 插入前自动生成 UUIDv7 */
  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateId();
    }
  }
}
